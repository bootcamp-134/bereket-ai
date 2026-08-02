import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bereket_ai_mobile/models/recipe.dart';
import 'package:bereket_ai_mobile/screens/recipe_catalog_screen.dart';
import 'package:bereket_ai_mobile/services/recipe_service.dart';

void main() {
  testWidgets('catalog loads recipes and opens live detail model', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: RecipeCatalogScreen(recipeService: _FakeRecipeService()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Sebze Yemeği'), findsOneWidget);
    await tester.tap(find.text('Sebze Yemeği'));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('recipe-detail-title')), findsOneWidget);
    expect(find.text('Tahminî maliyet: ₺85.50 (kısmi)'), findsOneWidget);
  });
}

class _FakeRecipeService implements RecipeService {
  static const recipe = Recipe(
    id: 'recipe-1',
    title: 'Sebze Yemeği',
    description: 'Mevsim sebzeleriyle hazırlanır.',
    preparationMinutes: 25,
    difficulty: 'Kolay',
    ingredients: [
      RecipeIngredient(name: 'Kabak', amount: '2 adet', estimatedCost: null),
    ],
    steps: ['Sebzeleri doğra.', 'Tencerede pişir.'],
    estimatedCost: RecipeEstimatedCost(amountTry: 85.5, isPartial: true),
  );

  @override
  Future<Recipe> getRecipe(String id) async => recipe;

  @override
  Future<RecipePage> listRecipes({
    String? search,
    int page = 1,
    int pageSize = 20,
  }) async => const RecipePage(recipes: [recipe], page: 1, hasMore: false);
}
