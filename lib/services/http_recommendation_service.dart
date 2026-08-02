import '../models/recipe.dart';
import '../models/recommendation.dart';
import '../network/api_client.dart';
import 'mock_recommendation_service.dart';
import 'recommendation_service.dart';

class HttpRecommendationService implements RecommendationService {
  final ApiClient _api;

  HttpRecommendationService(this._api);

  @override
  Future<RecommendationBatch> recommend(RecommendationRequest request) async {
    final data =
        await _api.post(
              '/recommendations/recipes',
              data: {
                'availableIngredients': request.availableIngredients,
                'wantsToShop': request.wantsToShop,
                if (request.wantsToShop) 'budgetTry': request.budget,
              },
            )
            as Map<String, dynamic>;

    final available = request.availableIngredients
        .map(MockRecommendationService.normalizeIngredient)
        .toSet();
    final results = ((data['results'] as List?) ?? const [])
        .whereType<Map>()
        .map((raw) {
          final item = raw.cast<String, dynamic>();
          final recipe = Recipe.fromJson(
            (item['recipe'] as Map).cast<String, dynamic>(),
          );
          final missingNames =
              ((item['missingIngredients'] as List?) ?? const [])
                  .map((value) => value.toString())
                  .toList(growable: false);
          final missingNormalized = missingNames
              .map(MockRecommendationService.normalizeIngredient)
              .toSet();
          final matched = recipe.ingredients
              .where((ingredient) {
                final name = MockRecommendationService.normalizeIngredient(
                  ingredient.name,
                );
                return available.contains(name) &&
                    !missingNormalized.contains(name);
              })
              .toList(growable: false);
          final missing = missingNames
              .map(
                (name) =>
                    RecipeIngredient(name: name, amount: '', estimatedCost: 0),
              )
              .toList(growable: false);
          return RecipeRecommendation(
            recipe: recipe,
            matchPercentage: (item['matchPercentage'] as num?)?.round() ?? 0,
            matchedIngredients: matched,
            missingIngredients: missing,
            estimatedExtraCost: item['estimatedAdditionalCostTry'] as num? ?? 0,
            reason: item['reason']?.toString() ?? '',
          );
        })
        .toList(growable: false);

    return RecommendationBatch(
      recommendations: results,
      noResultsReason: data['noResultsReason']?.toString(),
      generatedBy: data['generatedBy']?.toString() ?? 'deterministic',
      fallback: data['fallback'] == true,
    );
  }
}
