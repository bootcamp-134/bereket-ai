import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { DatasetImportStatus, Prisma, PrismaClient } from "@prisma/client";
import { inferAllergens, normalizeTurkish } from "../src/common/normalize";

const EXPECTED_CHECKSUM =
  "63c0fdf21fe854477d31aa803de9be61e901a6b6ed37609217db9b71b3278c9b";
const EXPECTED_RECIPE_COUNT = 3005;
const EXPECTED_INGREDIENT_COUNT = 27382;
const EXPECTED_PRICED_COUNT = 21331;

type RawIngredient = {
  isim: string;
  miktar: number | null;
  birim: string | null;
  quantity: number | null;
  unit: string | null;
  ingredient_id: string | null;
  canonical_name: string | null;
  cost_quantity: number | null;
  cost_unit: string | null;
  price_per_cost_unit_try: number | null;
  default_estimated_cost_try: number | null;
  cost_status: string;
};

type RawRecipe = {
  recipe_id: string;
  tarif_adi: string;
  kategori: string | null;
  porsiyon: number | null;
  porsiyon_tipi: string | null;
  hazirlik_suresi_dk: number | null;
  pisirme_suresi_dk: number | null;
  zorluk: string | null;
  pisirme_yontemi: string[];
  malzemeler: RawIngredient[];
  yapilis_adimlari: string[];
  default_estimated_cost_try: number | null;
  estimated_cost_is_partial: boolean;
  costable_ingredient_count: number;
  total_ingredient_count: number;
  cost_coverage_ratio: number | null;
  cost_type: string | null;
  price_reference_date: string | null;
  missing_core_ingredient: boolean;
  cost_reliability: string | null;
  _source?: Record<string, unknown>;
};

const decimal = (value: number | null) =>
  value === null ? null : new Prisma.Decimal(value);

function description(recipe: RawRecipe) {
  return [recipe.kategori, recipe.zorluk, ...(recipe.pisirme_yontemi ?? [])]
    .filter(Boolean)
    .join(" · ");
}

async function main() {
  const filePath = resolve(process.argv[2] ?? "data/recipes.json");
  const buffer = await readFile(filePath);
  const checksum = createHash("sha256").update(buffer).digest("hex");
  if (checksum !== EXPECTED_CHECKSUM)
    throw new Error(`Dataset checksum uyuşmuyor: ${checksum}`);

  const recipes = JSON.parse(buffer.toString("utf8")) as RawRecipe[];
  const ingredientCount = recipes.reduce(
    (sum, recipe) => sum + recipe.malzemeler.length,
    0,
  );
  const pricedCount = recipes.reduce(
    (sum, recipe) =>
      sum +
      recipe.malzemeler.filter((item) => item.cost_status === "priced").length,
    0,
  );
  if (
    recipes.length !== EXPECTED_RECIPE_COUNT ||
    ingredientCount !== EXPECTED_INGREDIENT_COUNT ||
    pricedCount !== EXPECTED_PRICED_COUNT ||
    new Set(recipes.map((recipe) => recipe.recipe_id)).size !==
      EXPECTED_RECIPE_COUNT
  ) {
    throw new Error("Dataset beklenen kayıt istatistiklerini karşılamıyor.");
  }

  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error("DATABASE_URL_UNPOOLED veya DATABASE_URL tanımlı değil.");
  const adapter = /(?:localhost|127\.0\.0\.1)/.test(connectionString)
    ? new PrismaPg({ connectionString })
    : new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const existing = await prisma.datasetImport.findUnique({
      where: { checksum },
    });
    if (existing?.status === DatasetImportStatus.COMPLETED && existing.active) {
      process.stdout.write(`Dataset zaten aktif: ${existing.id}\n`);
      return;
    }
    const dataset = existing
      ? await prisma.datasetImport.update({
          where: { id: existing.id },
          data: { status: "PENDING", active: false, completedAt: null },
        })
      : await prisma.datasetImport.create({
          data: { checksum, sourceFile: basename(filePath) },
        });

    const ingredients = new Map<
      string,
      { id: string; canonicalName: string; normalizedName: string }
    >();
    const aliases = new Map<
      string,
      { ingredientId: string; alias: string; normalizedAlias: string }
    >();
    for (const recipe of recipes) {
      for (const item of recipe.malzemeler) {
        if (!item.ingredient_id) continue;
        const canonicalName = item.canonical_name ?? item.isim;
        ingredients.set(item.ingredient_id, {
          id: item.ingredient_id,
          canonicalName,
          normalizedName: normalizeTurkish(canonicalName),
        });
        const normalizedAlias = normalizeTurkish(item.isim);
        aliases.set(normalizedAlias, {
          ingredientId: item.ingredient_id,
          alias: item.isim,
          normalizedAlias,
        });
      }
    }
    await prisma.ingredient.createMany({
      data: [...ingredients.values()],
      skipDuplicates: true,
    });
    await prisma.ingredientAlias.createMany({
      data: [...aliases.values()],
      skipDuplicates: true,
    });

    for (let offset = 0; offset < recipes.length; offset += 40) {
      const batch = recipes.slice(offset, offset + 40);
      for (const recipe of batch) {
        const common = {
          datasetImportId: dataset.id,
          title: recipe.tarif_adi,
          normalizedTitle: normalizeTurkish(recipe.tarif_adi),
          description: description(recipe) || null,
          category: recipe.kategori,
          servings: decimal(recipe.porsiyon),
          servingType: recipe.porsiyon_tipi,
          preparationMinutes: recipe.hazirlik_suresi_dk,
          cookingMinutes: recipe.pisirme_suresi_dk,
          difficulty: recipe.zorluk,
          cookingMethods: recipe.pisirme_yontemi ?? [],
          defaultEstimatedCostTry: decimal(recipe.default_estimated_cost_try),
          estimatedCostIsPartial: recipe.estimated_cost_is_partial,
          costableIngredientCount: recipe.costable_ingredient_count,
          totalIngredientCount: recipe.total_ingredient_count,
          costCoverageRatio: decimal(recipe.cost_coverage_ratio),
          costType: recipe.cost_type,
          priceReferenceDate: recipe.price_reference_date
            ? new Date(recipe.price_reference_date)
            : null,
          costReliability: recipe.cost_reliability,
          allergenCategories: inferAllergens(
            recipe.malzemeler.map((item) => item.canonical_name ?? item.isim),
          ),
          allergenDataStatus: "inferred",
          missingCoreIngredient: recipe.missing_core_ingredient,
          sourceMetadata: (recipe._source ?? {}) as Prisma.InputJsonValue,
        };
        await prisma.$transaction(async (tx) => {
          await tx.recipe.upsert({
            where: { id: recipe.recipe_id },
            create: { id: recipe.recipe_id, ...common },
            update: common,
          });
          await tx.recipeIngredient.deleteMany({
            where: { recipeId: recipe.recipe_id },
          });
          await tx.recipeStep.deleteMany({
            where: { recipeId: recipe.recipe_id },
          });
          await tx.recipeIngredient.createMany({
            data: recipe.malzemeler.map((item, position) => ({
              recipeId: recipe.recipe_id,
              ingredientId: item.ingredient_id,
              position,
              displayName: item.isim,
              normalizedName: normalizeTurkish(
                item.canonical_name ?? item.isim,
              ),
              displayAmount: decimal(item.miktar),
              displayUnit: item.birim,
              quantity: decimal(item.quantity),
              unit: item.unit,
              costQuantity: decimal(item.cost_quantity),
              costUnit: item.cost_unit,
              pricePerCostUnitTry: decimal(item.price_per_cost_unit_try),
              defaultEstimatedCostTry: decimal(item.default_estimated_cost_try),
              costStatus: item.cost_status,
            })),
          });
          await tx.recipeStep.createMany({
            data: recipe.yapilis_adimlari.map((text, index) => ({
              recipeId: recipe.recipe_id,
              order: index + 1,
              text,
            })),
          });
        });
      }
      process.stdout.write(
        `\r${Math.min(offset + batch.length, recipes.length)}/${recipes.length}`,
      );
    }

    await prisma.$transaction([
      prisma.datasetImport.updateMany({
        where: { active: true },
        data: { active: false },
      }),
      prisma.datasetImport.update({
        where: { id: dataset.id },
        data: {
          status: "COMPLETED",
          active: true,
          recipeCount: recipes.length,
          ingredientCount,
          pricedCount,
          completedAt: new Date(),
          summary: {
            checksum,
            fullCostRecipes: recipes.filter(
              (recipe) => !recipe.estimated_cost_is_partial,
            ).length,
            partialCostRecipes: recipes.filter(
              (recipe) => recipe.estimated_cost_is_partial,
            ).length,
          },
        },
      }),
    ]);
    process.stdout.write(`\nImport tamamlandı: ${dataset.id}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Bilinmeyen import hatası";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
