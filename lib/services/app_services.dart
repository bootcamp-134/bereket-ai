import '../network/api_client.dart';
import '../navigation/app_navigator.dart';
import 'auth_service.dart';
import 'http_auth_service.dart';
import 'http_profile_service.dart';
import 'http_recipe_chat_service.dart';
import 'http_recipe_service.dart';
import 'http_recommendation_service.dart';
import 'profile_service.dart';
import 'recipe_chat_service.dart';
import 'recipe_service.dart';
import 'recommendation_service.dart';

class AppServices {
  static final AppServices instance = AppServices._();

  late final ApiClient api = ApiClient(
    onSessionExpired: AppNavigator.handleSessionExpired,
  );
  late final AuthService auth = HttpAuthService(api);
  late final ProfileService profile = HttpProfileService(api);
  late final RecommendationService recommendations = HttpRecommendationService(
    api,
  );
  late final RecipeChatService recipeChat = HttpRecipeChatService(api);
  late final RecipeService recipes = HttpRecipeService(api);

  AppServices._();
}
