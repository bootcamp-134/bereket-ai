import '../models/recipe.dart';
import '../network/api_client.dart';
import 'recipe_service.dart';

class HttpRecipeService implements RecipeService {
  final ApiClient _api;

  HttpRecipeService(this._api);

  @override
  Future<RecipePage> listRecipes({
    String? search,
    int page = 1,
    int pageSize = 20,
  }) async {
    final response = await _api.getWithMeta(
      '/recipes',
      query: {
        if (search != null && search.trim().isNotEmpty) 'search': search.trim(),
        'page': page,
        'pageSize': pageSize,
      },
    );
    final recipes = ((response.data as List?) ?? const [])
        .whereType<Map>()
        .map((item) => Recipe.fromJson(item.cast<String, dynamic>()))
        .toList(growable: false);
    final totalPages = (response.meta['totalPages'] as num?)?.round();
    return RecipePage(
      recipes: recipes,
      page: page,
      hasMore: totalPages == null
          ? recipes.length == pageSize
          : page < totalPages,
    );
  }

  @override
  Future<Recipe> getRecipe(String id) async {
    final data = await _api.get('/recipes/$id') as Map<String, dynamic>;
    return Recipe.fromJson(data);
  }
}
