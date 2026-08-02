import 'recipe.dart';

class RecommendationRequest {
  final List<String> availableIngredients;
  final bool wantsToShop;
  final int? budget;

  const RecommendationRequest({
    required this.availableIngredients,
    required this.wantsToShop,
    this.budget,
  });
}

class RecipeRecommendation {
  final Recipe recipe;
  final int matchPercentage;
  final List<RecipeIngredient> matchedIngredients;
  final List<RecipeIngredient> missingIngredients;
  final num estimatedExtraCost;
  final String reason;

  const RecipeRecommendation({
    required this.recipe,
    required this.matchPercentage,
    required this.matchedIngredients,
    required this.missingIngredients,
    required this.estimatedExtraCost,
    required this.reason,
  });
}

class RecommendationBatch {
  final List<RecipeRecommendation> recommendations;
  final String? noResultsReason;
  final String generatedBy;
  final bool fallback;

  const RecommendationBatch({
    required this.recommendations,
    this.noResultsReason,
    this.generatedBy = 'deterministic',
    this.fallback = false,
  });
}
