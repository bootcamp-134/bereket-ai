import 'package:flutter/material.dart';

import '../models/recipe.dart';
import '../services/app_services.dart';
import '../services/recipe_service.dart';
import '../theme/app_theme.dart';
import 'recipe_detail_screen.dart';

class RecipeCatalogScreen extends StatefulWidget {
  final RecipeService? recipeService;

  const RecipeCatalogScreen({super.key, this.recipeService});

  @override
  State<RecipeCatalogScreen> createState() => _RecipeCatalogScreenState();
}

class _RecipeCatalogScreenState extends State<RecipeCatalogScreen> {
  final _searchController = TextEditingController();
  final _recipes = <Recipe>[];
  late final RecipeService _service;
  bool _loading = true;
  bool _loadingMore = false;
  bool _hasMore = false;
  int _page = 1;
  String? _openingRecipeId;
  String? _error;

  @override
  void initState() {
    super.initState();
    _service = widget.recipeService ?? AppServices.instance.recipes;
    _load(reset: true);
  }

  Future<void> _load({required bool reset}) async {
    setState(() {
      if (reset) {
        _loading = true;
        _error = null;
      } else {
        _loadingMore = true;
      }
    });
    try {
      final nextPage = reset ? 1 : _page + 1;
      final result = await _service.listRecipes(
        search: _searchController.text,
        page: nextPage,
      );
      if (!mounted) return;
      setState(() {
        if (reset) _recipes.clear();
        _recipes.addAll(result.recipes);
        _page = result.page;
        _hasMore = result.hasMore;
        _loading = false;
        _loadingMore = false;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _loadingMore = false;
        _error = error.toString();
      });
    }
  }

  Future<void> _openRecipe(Recipe recipe) async {
    if (_openingRecipeId != null) return;
    setState(() => _openingRecipeId = recipe.id);
    try {
      final detail = await _service.getRecipe(recipe.id);
      if (!mounted) return;
      await Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => RecipeDetailScreen(standaloneRecipe: detail),
        ),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(error.toString())));
    } finally {
      if (mounted) setState(() => _openingRecipeId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Tüm Tarifler',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
      body: SafeArea(
        top: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 620),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
                  child: TextField(
                    key: const Key('recipe-search-field'),
                    controller: _searchController,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _load(reset: true),
                    decoration: InputDecoration(
                      labelText: 'Tarif ara',
                      hintText: 'Örn. mercimek çorbası',
                      prefixIcon: const Icon(Icons.search_rounded),
                      suffixIcon: IconButton(
                        tooltip: 'Ara',
                        onPressed: () => _load(reset: true),
                        icon: const Icon(Icons.arrow_forward_rounded),
                      ),
                    ),
                  ),
                ),
                Expanded(child: _buildContent()),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null && _recipes.isEmpty) {
      return _CatalogMessage(
        icon: Icons.cloud_off_outlined,
        message: _error!,
        actionLabel: 'Tekrar Dene',
        onAction: () => _load(reset: true),
      );
    }
    if (_recipes.isEmpty) {
      return _CatalogMessage(
        icon: Icons.search_off_rounded,
        message: 'Aramana uygun tarif bulunamadı.',
        actionLabel: 'Aramayı Temizle',
        onAction: () {
          _searchController.clear();
          _load(reset: true);
        },
      );
    }
    return ListView.separated(
      key: const Key('recipe-catalog-list'),
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 30),
      itemCount: _recipes.length + (_hasMore ? 1 : 0),
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        if (index == _recipes.length) {
          return FilledButton.tonal(
            onPressed: _loadingMore ? null : () => _load(reset: false),
            child: _loadingMore
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Daha Fazla Yükle'),
          );
        }
        final recipe = _recipes[index];
        return Card(
          margin: EdgeInsets.zero,
          child: ListTile(
            contentPadding: const EdgeInsets.all(14),
            leading: const CircleAvatar(
              backgroundColor: AppColors.sage,
              foregroundColor: AppColors.forest,
              child: Icon(Icons.restaurant_menu_rounded),
            ),
            title: Text(
              recipe.title,
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            subtitle: Text(
              '${recipe.preparationMinutes} dk • ${recipe.difficulty}',
            ),
            trailing: _openingRecipeId == recipe.id
                ? const SizedBox(
                    width: 22,
                    height: 22,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.chevron_right_rounded),
            onTap: () => _openRecipe(recipe),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}

class _CatalogMessage extends StatelessWidget {
  final IconData icon;
  final String message;
  final String actionLabel;
  final VoidCallback onAction;

  const _CatalogMessage({
    required this.icon,
    required this.message,
    required this.actionLabel,
    required this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 52, color: AppColors.forest),
            const SizedBox(height: 14),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton(onPressed: onAction, child: Text(actionLabel)),
          ],
        ),
      ),
    );
  }
}
