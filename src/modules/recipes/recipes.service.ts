import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiCode } from "../../common/api-code";
import type { RecipeQueryDto } from "./dto";
import {
  RecipesRepository,
  type RecipeWithDetails,
} from "./recipes.repository";

const decimal = (value: { toNumber(): number } | null) =>
  value === null ? null : value.toNumber();

export function serializeRecipe(recipe: RecipeWithDetails) {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    servings: decimal(recipe.servings),
    servingType: recipe.servingType,
    preparationMinutes: recipe.preparationMinutes,
    cookingMinutes: recipe.cookingMinutes,
    difficulty: recipe.difficulty,
    cookingMethods: recipe.cookingMethods,
    ingredients: recipe.ingredients.map((item) => ({
      name: item.displayName,
      amount: decimal(item.displayAmount),
      unit: item.displayUnit,
      estimatedCostTry: decimal(item.defaultEstimatedCostTry),
      costStatus: item.costStatus,
    })),
    steps: recipe.steps.map((step) => ({ order: step.order, text: step.text })),
    estimatedCost: {
      amountTry: decimal(recipe.defaultEstimatedCostTry),
      isPartial: recipe.estimatedCostIsPartial,
      coverageRatio: decimal(recipe.costCoverageRatio),
      reliability: recipe.costReliability,
      priceReferenceDate: recipe.priceReferenceDate,
      label: "Tahminî maliyet",
    },
    allergens: recipe.allergenCategories,
    allergenDataStatus: recipe.allergenDataStatus,
    missingCoreIngredient: recipe.missingCoreIngredient,
  };
}

@Injectable()
export class RecipesService {
  constructor(private readonly recipes: RecipesRepository) {}

  async listRecipes(query: RecipeQueryDto) {
    const excludeAllergens = (query.excludeAllergens ?? "")
      .split(",")
      .map((item) => item.trim().toLocaleLowerCase("tr-TR"))
      .filter(Boolean);
    const result = await this.recipes.list({ ...query, excludeAllergens });
    return {
      data: result.items.map(serializeRecipe),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / query.pageSize),
      },
    };
  }

  async getRecipe(recipeId: string) {
    const recipe = await this.recipes.findById(recipeId);
    if (!recipe) {
      throw new NotFoundException({
        code: ApiCode.NOT_FOUND,
        message: "Tarif bulunamadı.",
      });
    }
    return serializeRecipe(recipe);
  }
}
