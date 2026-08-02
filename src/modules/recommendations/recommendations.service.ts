import { Injectable } from "@nestjs/common";
import { normalizeTurkish } from "../../common/normalize";
import { AiService, type RerankCandidate } from "../ai/ai.service";
import { RecipesRepository } from "../recipes/recipes.repository";
import { serializeRecipe } from "../recipes/recipes.service";
import type { RecommendRecipesDto } from "./dto";
import {
  type CandidateRecipe,
  RecommendationsRepository,
} from "./recommendations.repository";

type ScoredCandidate = {
  recipe: CandidateRecipe;
  matchPercentage: number;
  missingIngredients: string[];
  estimatedAdditionalCostTry: number | null;
  score: number;
};

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly repository: RecommendationsRepository,
    private readonly recipes: RecipesRepository,
    private readonly ai: AiService,
  ) {}

  async recommendRecipes(
    userId: string,
    requestId: string,
    dto: RecommendRecipesDto,
  ) {
    const normalizedInput = [
      ...new Set(
        dto.availableIngredients.map(normalizeTurkish).filter(Boolean),
      ),
    ];
    const [canonicalNames, recipes, profile] = await Promise.all([
      this.repository.resolveIngredientNames(normalizedInput),
      this.repository.findCandidates(),
      this.repository.findProfile(userId),
    ]);
    const available = new Set([...normalizedInput, ...canonicalNames]);
    const allergens = new Set((profile?.allergens ?? []).map(normalizeTurkish));

    const safeCandidates = recipes
      .filter(
        (recipe) =>
          !recipe.allergenCategories.some((item) =>
            allergens.has(normalizeTurkish(item)),
          ),
      )
      .map((recipe) => this.score(recipe, available))
      .filter((candidate) => {
        if (!dto.wantsToShop) return candidate.missingIngredients.length === 0;
        return (
          candidate.estimatedAdditionalCostTry !== null &&
          candidate.estimatedAdditionalCostTry <= (dto.budgetTry ?? -1)
        );
      })
      .sort(
        (left, right) =>
          right.score - left.score ||
          (left.estimatedAdditionalCostTry ?? Number.MAX_VALUE) -
            (right.estimatedAdditionalCostTry ?? Number.MAX_VALUE) ||
          left.recipe.id.localeCompare(right.recipe.id),
      )
      .slice(0, 15);

    if (!safeCandidates.length) {
      return {
        results: [],
        noResultsReason: dto.wantsToShop
          ? "Alerjen ve bütçe kurallarına uyan, maliyeti güvenilir bir tarif bulunamadı."
          : "Yalnız elinizdeki malzemelerle eksiksiz hazırlanabilen güvenli bir tarif bulunamadı.",
        generatedBy: "deterministic",
        fallback: false,
      };
    }

    const aiCandidates: RerankCandidate[] = safeCandidates.map((candidate) => ({
      id: candidate.recipe.id,
      title: candidate.recipe.title,
      category: candidate.recipe.category,
      matchPercentage: candidate.matchPercentage,
      missingIngredients: candidate.missingIngredients,
      estimatedAdditionalCostTry: candidate.estimatedAdditionalCostTry,
      estimatedCostIsPartial: candidate.recipe.estimatedCostIsPartial,
    }));
    const rerank = await this.ai.rerankRecipes({
      userId,
      requestId,
      candidates: aiCandidates,
      wantsToShop: dto.wantsToShop,
      budgetTry: dto.budgetTry ?? null,
    });
    const safeById = new Map(
      safeCandidates.map((candidate) => [candidate.recipe.id, candidate]),
    );
    const ranked = rerank.value?.length
      ? rerank.value
          .map((item) => ({
            candidate: safeById.get(item.recipeId),
            reason: item.reason,
          }))
          .filter(
            (item): item is { candidate: ScoredCandidate; reason: string } =>
              Boolean(item.candidate),
          )
          .slice(0, 5)
      : safeCandidates.slice(0, 5).map((candidate) => ({
          candidate,
          reason:
            candidate.missingIngredients.length === 0
              ? "Elinizdeki malzemelerle eksiksiz hazırlanabilir."
              : `Malzeme uyumu %${candidate.matchPercentage}; tahminî ek maliyet bütçe içinde.`,
        }));

    const details = await Promise.all(
      ranked.map((item) => this.recipes.findById(item.candidate.recipe.id)),
    );
    return {
      results: ranked.flatMap((item, index) => {
        const recipe = details[index];
        if (!recipe) return [];
        return [
          {
            recipe: serializeRecipe(recipe),
            matchPercentage: item.candidate.matchPercentage,
            missingIngredients: item.candidate.missingIngredients,
            estimatedAdditionalCostTry:
              item.candidate.estimatedAdditionalCostTry,
            reason: item.reason,
          },
        ];
      }),
      noResultsReason: null,
      generatedBy: rerank.fallback ? "deterministic" : "openai",
      fallback: rerank.fallback,
    };
  }

  private score(
    recipe: CandidateRecipe,
    available: Set<string>,
  ): ScoredCandidate {
    const missing = recipe.ingredients.filter(
      (item) => !available.has(item.normalizedName),
    );
    const total = recipe.ingredients.length;
    const matched = total - missing.length;
    const matchPercentage = total ? Math.round((matched / total) * 100) : 0;
    const allMissingPriced = missing.every(
      (item) =>
        item.costStatus === "priced" && item.defaultEstimatedCostTry !== null,
    );
    const estimatedAdditionalCostTry = allMissingPriced
      ? Number(
          missing
            .reduce(
              (sum, item) => sum + Number(item.defaultEstimatedCostTry),
              0,
            )
            .toFixed(2),
        )
      : null;
    return {
      recipe,
      matchPercentage,
      missingIngredients: missing.map((item) => item.displayName),
      estimatedAdditionalCostTry,
      score: matchPercentage * 100 + Number(recipe.costCoverageRatio ?? 0),
    };
  }
}
