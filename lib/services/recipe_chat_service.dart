import '../models/recipe_chat.dart';

abstract interface class RecipeChatService {
  Future<RecipeChatSession> openSession(String recipeId);
  Future<String> createSession(String recipeId);
  Future<List<RecipeChatMessage>> getMessages(String sessionId);
  Future<RecipeChatReply> sendMessage({
    required String sessionId,
    required String message,
  });
}
