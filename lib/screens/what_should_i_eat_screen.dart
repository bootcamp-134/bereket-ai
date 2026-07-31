import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/recommendation.dart';
import '../services/mock_recommendation_service.dart';
import '../services/recommendation_service.dart';
import '../theme/app_theme.dart';
import '../widgets/primary_button.dart';
import 'recommendation_results_screen.dart';

class WhatShouldIEatScreen extends StatefulWidget {
  final RecommendationService? recommendationService;

  const WhatShouldIEatScreen({super.key, this.recommendationService});

  @override
  State<WhatShouldIEatScreen> createState() => _WhatShouldIEatScreenState();
}

class _WhatShouldIEatScreenState extends State<WhatShouldIEatScreen> {
  static const _suggestions = [
    'Patates',
    'Domates',
    'Soğan',
    'Makarna',
    'Kırmızı mercimek',
    'Yoğurt',
    'Tavuk',
    'Bulgur',
    'Biber',
    'Havuç',
    'Salça',
    'Sarımsak',
    'Zeytinyağı',
  ];
  static final _validIngredientPattern = RegExp(r'^[a-zA-ZçÇğĞıİöÖşŞüÜ\s-]+$');

  final _formKey = GlobalKey<FormState>();
  final _ingredientController = TextEditingController();
  final _budgetController = TextEditingController();
  final _ingredients = <String>[];

  late final RecommendationService _recommendationService;
  bool? _wantsToShop;
  bool _isLoading = false;
  String? _shoppingError;

  @override
  void initState() {
    super.initState();
    _recommendationService =
        widget.recommendationService ?? const MockRecommendationService();
  }

  void _addIngredient([String? suggestedIngredient]) {
    final rawValue = suggestedIngredient ?? _ingredientController.text;
    final ingredient = rawValue.trim().replaceAll(RegExp(r'\s+'), ' ');

    if (ingredient.length < 2) {
      _showMessage('En az 2 karakterden oluşan bir malzeme gir.');
      return;
    }
    if (ingredient.length > 40 ||
        !_validIngredientPattern.hasMatch(ingredient)) {
      _showMessage('Yalnızca harf, boşluk ve kısa çizgi kullanabilirsin.');
      return;
    }
    if (_ingredients.length >= 20) {
      _showMessage('En fazla 20 malzeme ekleyebilirsin.');
      return;
    }

    final normalized = MockRecommendationService.normalizeIngredient(
      ingredient,
    );
    final alreadyAdded = _ingredients.any(
      (existing) =>
          MockRecommendationService.normalizeIngredient(existing) == normalized,
    );
    if (alreadyAdded) {
      _showMessage('$ingredient zaten listende.');
      return;
    }

    setState(() => _ingredients.add(ingredient));
    _ingredientController.clear();
  }

  void _removeIngredient(String ingredient) {
    setState(() => _ingredients.remove(ingredient));
  }

  void _selectShoppingPreference(bool value) {
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() {
      _wantsToShop = value;
      _shoppingError = null;
      if (!value) _budgetController.clear();
    });
  }

  String? _validateBudget(String? value) {
    if (_wantsToShop != true) return null;

    final budget = int.tryParse(value?.trim() ?? '');
    if (budget == null || budget < 1) {
      return 'Geçerli bir bütçe girmelisin.';
    }
    if (budget > 100000) {
      return 'Bütçe en fazla 100.000 TL olabilir.';
    }
    return null;
  }

  Future<void> _findRecipes() async {
    FocusManager.instance.primaryFocus?.unfocus();
    final hasValidBudget = _formKey.currentState?.validate() ?? false;

    setState(() {
      _shoppingError = _wantsToShop == null
          ? 'Alışveriş tercihini seçmelisin.'
          : null;
    });
    if (_ingredients.isEmpty) {
      _showMessage('En az bir malzeme eklemelisin.');
      return;
    }
    if (_wantsToShop == null || !hasValidBudget) return;

    final request = RecommendationRequest(
      availableIngredients: List.unmodifiable(_ingredients),
      wantsToShop: _wantsToShop!,
      budget: _wantsToShop! ? int.parse(_budgetController.text) : null,
    );

    setState(() => _isLoading = true);
    try {
      final recommendations = await _recommendationService.recommend(request);
      if (!mounted) return;
      setState(() => _isLoading = false);
      await Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => RecommendationResultsScreen(
            request: request,
            recommendations: recommendations,
          ),
        ),
      );
    } on ArgumentError {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _showMessage('Bilgileri kontrol edip tekrar dene.');
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _showMessage('Öneriler şu anda oluşturulamadı. Tekrar dene.');
    }
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Ne Yesem?',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 620),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 54,
                          height: 54,
                          alignment: Alignment.center,
                          decoration: const BoxDecoration(
                            color: AppColors.sage,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.soup_kitchen_outlined,
                            color: AppColors.forest,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Evde neler var?',
                                style: theme.textTheme.headlineMedium,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Malzemelerini ve alışveriş bütçeni gir; uygun tarifleri eşleşme oranına göre sıralayalım.',
                                style: theme.textTheme.bodyLarge,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),
                    const _SectionTitle(
                      number: '1',
                      title: 'Malzemelerini ekle',
                      subtitle: 'En fazla 20 malzeme',
                    ),
                    const SizedBox(height: 12),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: TextField(
                            key: const Key('ingredient-input'),
                            controller: _ingredientController,
                            textCapitalization: TextCapitalization.sentences,
                            textInputAction: TextInputAction.done,
                            maxLength: 40,
                            inputFormatters: [
                              FilteringTextInputFormatter.allow(
                                RegExp(r'[a-zA-ZçÇğĞıİöÖşŞüÜ\s-]'),
                              ),
                            ],
                            onSubmitted: (_) => _addIngredient(),
                            decoration: const InputDecoration(
                              labelText: 'Malzeme',
                              hintText: 'Örn. domates',
                              prefixIcon: Icon(Icons.add_shopping_cart_rounded),
                              counterText: '',
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        SizedBox(
                          height: 60,
                          child: FilledButton(
                            key: const Key('add-ingredient-button'),
                            onPressed: _addIngredient,
                            style: FilledButton.styleFrom(
                              backgroundColor: AppColors.forest,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(
                                  AppRadii.control,
                                ),
                              ),
                            ),
                            child: const Text(
                              'Ekle',
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    if (_ingredients.isNotEmpty) ...[
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _ingredients
                            .map(
                              (ingredient) => InputChip(
                                key: ValueKey('ingredient-$ingredient'),
                                label: Text(ingredient),
                                deleteIcon: const Icon(
                                  Icons.close_rounded,
                                  size: 18,
                                ),
                                onDeleted: () => _removeIngredient(ingredient),
                                backgroundColor: AppColors.sage,
                                side: BorderSide.none,
                              ),
                            )
                            .toList(growable: false),
                      ),
                      const SizedBox(height: 16),
                    ],
                    Text(
                      'Hızlı ekle',
                      style: theme.textTheme.titleSmall?.copyWith(
                        color: AppColors.ink,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 9),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _suggestions
                          .map((suggestion) {
                            final isAdded = _ingredients.any(
                              (ingredient) =>
                                  MockRecommendationService.normalizeIngredient(
                                    ingredient,
                                  ) ==
                                  MockRecommendationService.normalizeIngredient(
                                    suggestion,
                                  ),
                            );
                            return ActionChip(
                              label: Text(suggestion),
                              avatar: Icon(
                                isAdded
                                    ? Icons.check_rounded
                                    : Icons.add_rounded,
                                size: 17,
                              ),
                              onPressed: isAdded
                                  ? null
                                  : () => _addIngredient(suggestion),
                            );
                          })
                          .toList(growable: false),
                    ),
                    const SizedBox(height: 30),
                    const _SectionTitle(
                      number: '2',
                      title: 'Alışveriş tercihin',
                      subtitle: 'Eksik malzemeler için',
                    ),
                    const SizedBox(height: 12),
                    _ShoppingChoice(
                      key: const Key('shopping-no'),
                      title: 'Hayır, evdekileri kullan',
                      subtitle: 'Yalnızca eksiksiz hazırlayabileceğin tarifler',
                      icon: Icons.inventory_2_outlined,
                      isSelected: _wantsToShop == false,
                      onTap: () => _selectShoppingPreference(false),
                    ),
                    const SizedBox(height: 10),
                    _ShoppingChoice(
                      key: const Key('shopping-yes'),
                      title: 'Evet, alışveriş yapabilirim',
                      subtitle: 'Bütçene uyan eksik malzemeler eklenebilir',
                      icon: Icons.shopping_bag_outlined,
                      isSelected: _wantsToShop == true,
                      onTap: () => _selectShoppingPreference(true),
                    ),
                    if (_shoppingError != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        _shoppingError!,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: AppColors.error,
                        ),
                      ),
                    ],
                    if (_wantsToShop == true) ...[
                      const SizedBox(height: 16),
                      TextFormField(
                        key: const Key('budget-input'),
                        controller: _budgetController,
                        keyboardType: TextInputType.number,
                        textInputAction: TextInputAction.done,
                        maxLength: 6,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        validator: _validateBudget,
                        onFieldSubmitted: (_) => _findRecipes(),
                        decoration: const InputDecoration(
                          labelText: 'Alışveriş bütçesi',
                          hintText: '250',
                          prefixIcon: Icon(Icons.payments_outlined),
                          prefixText: '₺ ',
                          counterText: '',
                        ),
                      ),
                    ],
                    const SizedBox(height: 28),
                    PrimaryButton(
                      key: const Key('find-recipes-button'),
                      label: 'Tarifleri Bul',
                      icon: Icons.search_rounded,
                      isLoading: _isLoading,
                      onPressed: _findRecipes,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _ingredientController.dispose();
    _budgetController.dispose();
    super.dispose();
  }
}

class _SectionTitle extends StatelessWidget {
  final String number;
  final String title;
  final String subtitle;

  const _SectionTitle({
    required this.number,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
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
            number,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        const SizedBox(width: 11),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              color: AppColors.ink,
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        Text(
          subtitle,
          style: const TextStyle(color: AppColors.mutedInk, fontSize: 12),
        ),
      ],
    );
  }
}

class _ShoppingChoice extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _ShoppingChoice({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      selected: isSelected,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.card),
        child: AnimatedContainer(
          duration: AppMotion.standard,
          curve: AppMotion.curve,
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.sage : Colors.white,
            borderRadius: BorderRadius.circular(AppRadii.card),
            border: Border.all(
              color: isSelected ? AppColors.forest : AppColors.outline,
              width: isSelected ? 1.4 : 1,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.forest : AppColors.cream,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: isSelected ? Colors.white : AppColors.forest,
                  size: 22,
                ),
              ),
              const SizedBox(width: 13),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: AppColors.ink,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: AppColors.mutedInk,
                        fontSize: 12,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                isSelected
                    ? Icons.radio_button_checked_rounded
                    : Icons.radio_button_off_rounded,
                color: isSelected ? AppColors.forest : AppColors.outline,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
