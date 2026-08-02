import '../models/recipe_chat.dart';

abstract interface class RecipeChatService {
  Future<String> createSession(String recipeId);
  Future<RecipeChatReply> sendMessage({
    required String sessionId,
    required String message,
  });
}
