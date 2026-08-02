import { describe, expect, it, vi } from "vitest";
import { RecommendationsService } from "../src/modules/recommendations/recommendations.service";

function candidate(input: {
  id: string;
  allergens?: string[];
  partial?: boolean;
  ingredient?: string;
  priced?: boolean;
}) {
  return {
    id: input.id,
    title: input.id,
    category: "test",
    allergenCategories: input.allergens ?? [],
    estimatedCostIsPartial: input.partial ?? false,
    costCoverageRatio: input.partial ? 0.5 : 1,
    ingredients: [
      {
        normalizedName: input.ingredient ?? "domates",
        displayName: input.ingredient ?? "domates",
        costStatus: input.priced === false ? "missing" : "priced",
        defaultEstimatedCostTry: input.priced === false ? null : 10,
      },
    ],
  };
}

function harness(input: {
  candidates: ReturnType<typeof candidate>[];
  allergens?: string[];
}) {
  const repository = {
    resolveIngredientNames: vi.fn().mockResolvedValue([]),
    findCandidates: vi.fn().mockResolvedValue(input.candidates),
    findProfile: vi
      .fn()
      .mockResolvedValue({ allergens: input.allergens ?? [] }),
  };
  const recipes = {
    findById: vi.fn(async (id: string) => ({
      id,
      title: id,
      description: null,
      category: "test",
      ingredients: [],
      steps: [],
      servings: null,
      servingType: null,
      preparationMinutes: null,
      cookingMinutes: null,
      difficulty: null,
      cookingMethods: [],
      defaultEstimatedCostTry: null,
      estimatedCostIsPartial: false,
      costCoverageRatio: null,
      costReliability: null,
      priceReferenceDate: null,
      allergenCategories: [],
      allergenDataStatus: "inferred",
      missingCoreIngredient: false,
    })),
  };
  const ai = {
    rerankRecipes: vi.fn(
      async ({ candidates }: { candidates: Array<{ id: string }> }) => ({
        value: candidates.map((item) => ({
          recipeId: item.id,
          reason: "Uygun",
        })),
        fallback: false,
        fallbackReason: null,
      }),
    ),
  };
  return {
    service: new RecommendationsService(
      repository as never,
      recipes as never,
      ai as never,
    ),
    ai,
  };
}

describe("RecommendationsService deterministic safety gates", () => {
  it("hard-filters profile allergens before the model sees candidates", async () => {
    const { service, ai } = harness({
      candidates: [
        candidate({ id: "rec_sut", allergens: ["süt"] }),
        candidate({ id: "rec_guvenli" }),
      ],
      allergens: ["SÜT"],
    });
    const result = await service.recommendRecipes("user_1", "req_1", {
      availableIngredients: ["domates"],
      wantsToShop: false,
    });
    expect(result.results).toHaveLength(1);
    expect(ai.rerankRecipes.mock.calls[0][0].candidates).toEqual([
      expect.objectContaining({ id: "rec_guvenli" }),
    ]);
  });

  it("does not present partially priced recipes as budget-compatible", async () => {
    const { service, ai } = harness({
      candidates: [
        candidate({
          id: "rec_partial",
          partial: true,
          ingredient: "pirinç",
        }),
      ],
    });
    const result = await service.recommendRecipes("user_1", "req_2", {
      availableIngredients: ["domates"],
      wantsToShop: true,
      budgetTry: 100,
    });
    expect(result.results).toEqual([]);
    expect(result.noResultsReason).toContain("maliyeti güvenilir");
    expect(ai.rerankRecipes).not.toHaveBeenCalled();
  });

  it("requires every missing ingredient to have a known price", async () => {
    const { service, ai } = harness({
      candidates: [
        candidate({
          id: "rec_unpriced",
          ingredient: "safran",
          priced: false,
        }),
      ],
    });
    const result = await service.recommendRecipes("user_1", "req_3", {
      availableIngredients: ["domates"],
      wantsToShop: true,
      budgetTry: 1000,
    });
    expect(result.results).toEqual([]);
    expect(ai.rerankRecipes).not.toHaveBeenCalled();
  });

  it("returns only recipes that can be completed without shopping", async () => {
    const { service, ai } = harness({
      candidates: [candidate({ id: "rec_missing", ingredient: "pirinç" })],
    });
    const result = await service.recommendRecipes("user_1", "req_4", {
      availableIngredients: ["domates"],
      wantsToShop: false,
    });
    expect(result.results).toEqual([]);
    expect(result.noResultsReason).toContain("eksiksiz");
    expect(ai.rerankRecipes).not.toHaveBeenCalled();
  });
});
