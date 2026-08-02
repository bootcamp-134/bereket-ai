import '../data/mock_recipes.dart';
import '../models/recipe.dart';
import '../models/recommendation.dart';
import 'recommendation_service.dart';

class MockRecommendationService implements RecommendationService {
  static final _validIngredientPattern = RegExp(r'^[a-zA-ZçÇğĞıİöÖşŞüÜ\s-]+$');

  final Duration simulatedLatency;

  const MockRecommendationService({
    this.simulatedLatency = const Duration(milliseconds: 550),
  });

  static String normalizeIngredient(String value) {
    final turkishLowercase = value
        .replaceAll('İ', 'i')
        .replaceAll('I', 'ı')
        .replaceAll('Ğ', 'ğ')
        .replaceAll('Ü', 'ü')
        .replaceAll('Ş', 'ş')
        .replaceAll('Ö', 'ö')
        .replaceAll('Ç', 'ç')
        .toLowerCase()
        .replaceAll('\u0307', '');

    return turkishLowercase.trim().replaceAll(RegExp(r'\s+'), ' ');
  }

  @override
  Future<RecommendationBatch> recommend(RecommendationRequest request) async {
    _validateRequest(request);
    if (simulatedLatency > Duration.zero) {
      await Future<void>.delayed(simulatedLatency);
    }

    final available = request.availableIngredients
        .map(normalizeIngredient)
        .where((ingredient) => ingredient.isNotEmpty)
        .toSet();
    final recommendations = <RecipeRecommendation>[];

    for (final recipe in MockRecipes.all) {
      final matched = <RecipeIngredient>[];
      final missing = <RecipeIngredient>[];

      for (final ingredient in recipe.ingredients) {
        if (available.contains(normalizeIngredient(ingredient.name))) {
          matched.add(ingredient);
        } else {
          missing.add(ingredient);
        }
      }

      if (matched.isEmpty) continue;
      if (!request.wantsToShop && missing.isNotEmpty) continue;

      final estimatedCost = missing.fold<int>(
        0,
        (sum, ingredient) => sum + (ingredient.estimatedCost ?? 0).round(),
      );
      if (request.wantsToShop && estimatedCost > request.budget!) continue;

      // This is a deterministic mock score, not an AI prediction.
      // Four matched ingredients in a five-ingredient recipe equals 80%.
      final matchPercentage =
          ((matched.length / recipe.ingredients.length) * 100).round();

      recommendations.add(
        RecipeRecommendation(
          recipe: recipe,
          matchPercentage: matchPercentage,
          matchedIngredients: List.unmodifiable(matched),
          missingIngredients: List.unmodifiable(missing),
          estimatedExtraCost: estimatedCost,
          reason: _buildReason(
            matchPercentage: matchPercentage,
            missingCount: missing.length,
            estimatedCost: estimatedCost,
          ),
        ),
      );
    }

    recommendations.sort((first, second) {
      final scoreOrder = second.matchPercentage.compareTo(
        first.matchPercentage,
      );
      if (scoreOrder != 0) return scoreOrder;

      final costOrder = (first.estimatedExtraCost ?? double.infinity).compareTo(
        second.estimatedExtraCost ?? double.infinity,
      );
      if (costOrder != 0) return costOrder;

      return first.recipe.preparationMinutes.compareTo(
        second.recipe.preparationMinutes,
      );
    });

    return RecommendationBatch(
      recommendations: List.unmodifiable(recommendations),
    );
  }

  void _validateRequest(RecommendationRequest request) {
    if (request.availableIngredients.isEmpty ||
        request.availableIngredients.length > 20) {
      throw ArgumentError('Malzeme sayısı 1 ile 20 arasında olmalı.');
    }

    if (request.availableIngredients.any(
      (ingredient) =>
          ingredient.trim().length < 2 ||
          ingredient.trim().length > 40 ||
          !_validIngredientPattern.hasMatch(ingredient.trim()),
    )) {
      throw ArgumentError('Malzeme biçimi geçersiz.');
    }

    if (request.wantsToShop &&
        (request.budget == null ||
            request.budget! < 1 ||
            request.budget! > 100000)) {
      throw ArgumentError('Bütçe 1 ile 100.000 TL arasında olmalı.');
    }
  }

  String _buildReason({
    required int matchPercentage,
    required int missingCount,
    required int estimatedCost,
  }) {
    if (missingCount == 0) {
      return 'Tüm malzemeler evinde var; alışveriş yapmadan hazırlayabilirsin.';
    }
    return 'Malzemelerin %$matchPercentage oranında eşleşiyor. '
        '$missingCount eksik malzeme için tahmini ₺$estimatedCost gerekiyor.';
  }
}
