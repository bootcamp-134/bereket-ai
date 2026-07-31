import 'package:bereket_ai_mobile/models/recipe.dart';
import 'package:bereket_ai_mobile/models/recommendation.dart';
import 'package:bereket_ai_mobile/screens/recommendation_results_screen.dart';
import 'package:bereket_ai_mobile/screens/welcome_screen.dart';
import 'package:bereket_ai_mobile/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('welcome content fits a narrow Turkish mobile layout', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(320, 720));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      MaterialApp(theme: AppTheme.light, home: const WelcomeScreen()),
    );

    expect(find.text('BereketAI'), findsOneWidget);
    expect(
      find.text('Kalan malzemeleri tariflerde değerlendir'),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('long Turkish recipe content does not overflow', (tester) async {
    await tester.binding.setSurfaceSize(const Size(320, 720));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    const recipe = Recipe(
      id: 'long-turkish-title',
      title: 'Zeytinyağlı Kırmızı Mercimekli Mevsim Sebzeleri Yemeği',
      description:
          'Farklı uzunluktaki Türkçe metinlerle taşma davranışını sınayan tarif.',
      preparationMinutes: 47,
      difficulty: 'Orta',
      ingredients: [
        RecipeIngredient(
          name: 'Kırmızı mercimek',
          amount: '1,5 su bardağı',
          estimatedCost: 43,
        ),
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '2 yemek kaşığı',
          estimatedCost: 16,
        ),
      ],
      steps: ['Malzemeleri hazırla.', 'Kısık ateşte kontrollü şekilde pişir.'],
    );
    const recommendation = RecipeRecommendation(
      recipe: recipe,
      matchPercentage: 50,
      matchedIngredients: [
        RecipeIngredient(
          name: 'Kırmızı mercimek',
          amount: '1,5 su bardağı',
          estimatedCost: 43,
        ),
      ],
      missingIngredients: [
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '2 yemek kaşığı',
          estimatedCost: 16,
        ),
      ],
      estimatedExtraCost: 16,
      reason:
          'Evindeki malzemeler tarifin yarısıyla eşleşiyor; eksik malzemeyi bütçene göre ekleyebilirsin.',
    );

    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const RecommendationResultsScreen(
          request: RecommendationRequest(
            availableIngredients: ['Kırmızı mercimek'],
            wantsToShop: true,
            budget: 160,
          ),
          recommendations: [recommendation],
        ),
      ),
    );

    expect(find.text(recipe.title), findsOneWidget);
    expect(find.text('Tarifi Gör'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('no-result state explains recovery action', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const RecommendationResultsScreen(
          request: RecommendationRequest(
            availableIngredients: ['Enginar'],
            wantsToShop: false,
          ),
          recommendations: [],
        ),
      ),
    );

    expect(find.text('Uygun tarif bulamadık'), findsOneWidget);
    expect(find.text('Bilgileri Değiştir'), findsOneWidget);
  });
}
