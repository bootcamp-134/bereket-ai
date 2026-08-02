import 'package:flutter/material.dart';

import '../models/recommendation.dart';
import '../testing/app_semantics.dart';
import '../theme/app_theme.dart';
import 'recipe_detail_screen.dart';

class RecommendationResultsScreen extends StatelessWidget {
  final RecommendationRequest request;
  final List<RecipeRecommendation> recommendations;
  final String? noResultsReason;
  final String generatedBy;
  final bool fallback;

  const RecommendationResultsScreen({
    super.key,
    required this.request,
    required this.recommendations,
    this.noResultsReason,
    this.generatedBy = 'deterministic',
    this.fallback = false,
  });

  void _openRecipe(BuildContext context, RecipeRecommendation recommendation) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => RecipeDetailScreen(recommendation: recommendation),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Tarif Önerileri',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
      body: SafeArea(
        top: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 620),
            child: recommendations.isEmpty
                ? _EmptyResults(
                    reason: noResultsReason,
                    onChangeInputs: () => Navigator.pop(context),
                  )
                : Semantics(
                    identifier: AppSemantics.recommendationList,
                    child: ListView.separated(
                      key: const Key('recommendation-results-list'),
                      padding: const EdgeInsets.fromLTRB(20, 10, 20, 32),
                      itemCount: recommendations.length + 1,
                      separatorBuilder: (_, _) => const SizedBox(height: 14),
                      itemBuilder: (context, index) {
                        if (index == 0) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                '${recommendations.length} uygun tarif bulduk',
                                style: theme.textTheme.headlineMedium,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '${request.availableIngredients.length} malzemene göre, en yüksek eşleşmeden başlayarak sıralandı.',
                                style: theme.textTheme.bodyLarge,
                              ),
                              const SizedBox(height: 12),
                              if (fallback || generatedBy == 'openai') ...[
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: AppColors.cream,
                                    borderRadius: BorderRadius.circular(
                                      AppRadii.control,
                                    ),
                                  ),
                                  child: Text(
                                    fallback
                                        ? 'Yapay zekâ yanıt veremedi; güvenli yedek sıralama kullanıldı.'
                                        : 'Öneriler yapay zekâ ile kişiselleştirildi.',
                                    style: const TextStyle(
                                      color: AppColors.mutedInk,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),
                              ],
                              Container(
                                padding: const EdgeInsets.all(13),
                                decoration: BoxDecoration(
                                  color: AppColors.sage.withValues(alpha: 0.62),
                                  borderRadius: BorderRadius.circular(
                                    AppRadii.control,
                                  ),
                                ),
                                child: const Text(
                                  'Eşleşme oranı, evindeki malzemelerin tarife ne kadar uyduğunu gösterir.',
                                  style: TextStyle(
                                    color: AppColors.forestDark,
                                    fontSize: 12,
                                    height: 1.4,
                                  ),
                                ),
                              ),
                            ],
                          );
                        }

                        final recommendation = recommendations[index - 1];
                        return _RecommendationCard(
                          recommendation: recommendation,
                          onOpen: () => _openRecipe(context, recommendation),
                        );
                      },
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}

class _RecommendationCard extends StatelessWidget {
  final RecipeRecommendation recommendation;
  final VoidCallback onOpen;

  const _RecommendationCard({
    required this.recommendation,
    required this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    final recipe = recommendation.recipe;

    return Card(
      margin: EdgeInsets.zero,
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadii.card),
        side: const BorderSide(color: AppColors.outline),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 54,
                  height: 54,
                  decoration: const BoxDecoration(
                    color: AppColors.sage,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.restaurant_menu_rounded,
                    color: AppColors.forest,
                  ),
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        recipe.title,
                        style: const TextStyle(
                          color: AppColors.ink,
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        '${recipe.preparationMinutes} dk  •  ${recipe.difficulty}',
                        style: const TextStyle(
                          color: AppColors.mutedInk,
                          fontSize: 12,
                          height: 1.40,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  key: ValueKey('match-${recipe.id}'),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 11,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.forest,
                    borderRadius: BorderRadius.circular(AppRadii.control),
                  ),
                  child: Text(
                    '%${recommendation.matchPercentage}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              recommendation.reason,
              style: const TextStyle(color: AppColors.mutedInk, height: 1.4),
            ),
            const SizedBox(height: 14),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _InfoPill(
                  icon: Icons.check_circle_outline_rounded,
                  label:
                      '${recommendation.matchedIngredients.length} malzeme sende',
                ),
                _InfoPill(
                  icon: Icons.shopping_bag_outlined,
                  label: _additionalCostLabel(
                    recommendation.estimatedExtraCost,
                  ),
                ),
              ],
            ),
            if (recommendation.missingIngredients.isNotEmpty) ...[
              const SizedBox(height: 14),
              Text(
                'Eksikler: ${recommendation.missingIngredients.map((item) => item.name).join(', ')}',
                style: const TextStyle(
                  color: AppColors.ink,
                  fontSize: 12,
                  height: 1.40,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
            const SizedBox(height: 16),
            Semantics(
              identifier: AppSemantics.recipeOpen(recipe.id),
              button: true,
              child: FilledButton.icon(
                key: ValueKey('open-recipe-${recipe.id}'),
                onPressed: onOpen,
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.forest,
                  minimumSize: const Size.fromHeight(50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadii.control),
                  ),
                ),
                icon: const Icon(Icons.menu_book_outlined),
                label: const Text(
                  'Tarifi Gör',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

String _additionalCostLabel(num? cost) {
  if (cost == null) return 'Ek maliyet bilinmiyor';
  if (cost == 0) return 'Ek masraf yok';
  final amount = cost % 1 == 0
      ? cost.toInt().toString()
      : cost.toStringAsFixed(2);
  return 'Tahminî ₺$amount';
}

class _InfoPill extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoPill({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(AppRadii.pill),
        border: Border.all(color: AppColors.outline),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.forest, size: 17),
          const SizedBox(width: 6),
          Text(
            label,
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

class _EmptyResults extends StatelessWidget {
  final VoidCallback onChangeInputs;
  final String? reason;

  const _EmptyResults({required this.onChangeInputs, this.reason});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 70, 24, 32),
      child: Column(
        children: [
          Container(
            width: 92,
            height: 92,
            decoration: const BoxDecoration(
              color: AppColors.sage,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.search_off_rounded,
              color: AppColors.forest,
              size: 44,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Uygun tarif bulamadık',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 10),
          Text(
            reason ??
                'Daha fazla malzeme eklemeyi, alışveriş seçeneğini açmayı veya bütçeni değiştirmeyi deneyebilirsin.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: onChangeInputs,
            icon: const Icon(Icons.tune_rounded),
            label: const Text('Bilgileri Değiştir'),
          ),
        ],
      ),
    );
  }
}
