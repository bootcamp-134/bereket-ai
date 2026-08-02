import '../models/recipe_chat.dart';
import '../network/api_client.dart';
import 'recipe_chat_service.dart';

class HttpRecipeChatService implements RecipeChatService {
  final ApiClient _api;

  HttpRecipeChatService(this._api);

  @override
  Future<String> createSession(String recipeId) async {
    final data =
        await _api.post('/recipe-chat/sessions', data: {'recipeId': recipeId})
            as Map<String, dynamic>;
    return data['id'] as String;
  }

  @override
  Future<RecipeChatReply> sendMessage({
    required String sessionId,
    required String message,
  }) async {
    final data =
        await _api.post(
              '/recipe-chat/sessions/$sessionId/messages',
              data: {'message': message},
            )
            as Map<String, dynamic>;
    final assistant = (data['assistantMessage'] as Map).cast<String, dynamic>();
    return RecipeChatReply(
      content: assistant['content']?.toString() ?? '',
      fallback: assistant['fallback'] == true,
      warnings: ((data['warnings'] as List?) ?? const [])
          .map((value) => value.toString())
          .toList(growable: false),
    );
  }
}
