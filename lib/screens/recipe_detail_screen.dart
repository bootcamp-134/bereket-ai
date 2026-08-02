import 'package:flutter/material.dart';

import '../models/recommendation.dart';
import '../services/mock_recommendation_service.dart';
import '../testing/app_semantics.dart';
import '../theme/app_theme.dart';
import '../widgets/primary_button.dart';
import 'recipe_assistant_screen.dart';

class RecipeDetailScreen extends StatelessWidget {
  final RecipeRecommendation recommendation;

  const RecipeDetailScreen({super.key, required this.recommendation});

  @override
  Widget build(BuildContext context) {
    final recipe = recommendation.recipe;
    final matchedNames = recommendation.matchedIngredients
        .map(
          (ingredient) =>
              MockRecommendationService.normalizeIngredient(ingredient.name),
        )
        .toSet();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Tarif Detayı',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
      body: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 34),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 620),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    height: 190,
                    decoration: BoxDecoration(
                      color: AppColors.forestDark,
                      borderRadius: BorderRadius.circular(AppRadii.card),
                    ),
                    child: Stack(
                      children: [
                        const Center(
                          child: Icon(
                            Icons.soup_kitchen_rounded,
                            color: Colors.white,
                            size: 78,
                          ),
                        ),
                        Positioned(
                          right: 16,
                          top: 16,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(
                                AppRadii.control,
                              ),
                            ),
                            child: Text(
                              '%${recommendation.matchPercentage} eşleşme',
                              style: const TextStyle(
                                color: AppColors.forest,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 22),
                  Text(
                    recipe.title,
                    key: const Key('recipe-detail-title'),
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    recipe.description,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 9,
                    runSpacing: 9,
                    children: [
                      _DetailPill(
                        icon: Icons.schedule_rounded,
                        text: '${recipe.preparationMinutes} dakika',
                      ),
                      _DetailPill(
                        icon: Icons.signal_cellular_alt_rounded,
                        text: recipe.difficulty,
                      ),
                      _DetailPill(
                        icon: Icons.payments_outlined,
                        text: recommendation.estimatedExtraCost == 0
                            ? 'Ek masraf yok'
                            : 'Tahmini ₺${recommendation.estimatedExtraCost}',
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),
                  const _DetailHeading(
                    icon: Icons.shopping_basket_outlined,
                    title: 'Malzemeler',
                  ),
                  const SizedBox(height: 12),
                  ...recipe.ingredients.map((ingredient) {
                    final isAvailable = matchedNames.contains(
                      MockRecommendationService.normalizeIngredient(
                        ingredient.name,
                      ),
                    );
                    return Container(
                      margin: const EdgeInsets.only(bottom: 9),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadii.card),
                        border: Border.all(color: AppColors.outline),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isAvailable
                                ? Icons.check_circle_rounded
                                : Icons.add_shopping_cart_rounded,
                            color: isAvailable
                                ? AppColors.forest
                                : AppColors.harvest,
                            size: 21,
                          ),
                          const SizedBox(width: 11),
                          Expanded(
                            child: Text(
                              ingredient.name,
                              style: const TextStyle(
                                color: AppColors.ink,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          Text(
                            ingredient.amount,
                            style: const TextStyle(
                              color: AppColors.mutedInk,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 22),
                  const _DetailHeading(
                    icon: Icons.format_list_numbered_rounded,
                    title: 'Hazırlanışı',
                  ),
                  const SizedBox(height: 12),
                  ...recipe.steps.indexed.map(
                    (entry) => Padding(
                      padding: const EdgeInsets.only(bottom: 14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 34,
                            height: 34,
                            alignment: Alignment.center,
                            decoration: const BoxDecoration(
                              color: AppColors.forest,
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              '${entry.$1 + 1}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(top: 6),
                              child: Text(
                                entry.$2,
                                style: const TextStyle(
                                  color: AppColors.ink,
                                  height: 1.45,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  PrimaryButton(
                    label: 'Bana Yardım Et',
                    icon: Icons.chat_bubble_outline_rounded,
                    semanticIdentifier: AppSemantics.recipeAssistantOpen,
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => RecipeAssistantScreen(recipe: recipe),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _DetailHeading extends StatelessWidget {
  final IconData icon;
  final String title;

  const _DetailHeading({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppColors.forest, size: 23),
        const SizedBox(width: 9),
        Text(
          title,
          style: const TextStyle(
            color: AppColors.ink,
            fontSize: 18,
            height: 1.30,
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    );
  }
}

class _DetailPill extends StatelessWidget {
  final IconData icon;
  final String text;

  const _DetailPill({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 9),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadii.pill),
        border: Border.all(color: AppColors.outline),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.forest, size: 17),
          const SizedBox(width: 6),
          Text(
            text,
            style: const TextStyle(
              color: AppColors.ink,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
