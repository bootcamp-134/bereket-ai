import '../models/recipe.dart';

abstract interface class RecipeService {
  Future<RecipePage> listRecipes({
    String? search,
    int page = 1,
    int pageSize = 20,
  });

  Future<Recipe> getRecipe(String id);
}
