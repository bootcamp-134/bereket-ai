import '../models/recipe_chat.dart';
import '../network/api_client.dart';
import '../network/api_exception.dart';
import '../storage/recipe_chat_session_storage.dart';
import 'recipe_chat_service.dart';

class HttpRecipeChatService implements RecipeChatService {
  final ApiClient _api;
  final RecipeChatSessionStorage _sessions;

  HttpRecipeChatService(this._api, {RecipeChatSessionStorage? sessionStorage})
    : _sessions = sessionStorage ?? const SecureRecipeChatSessionStorage();

  @override
  Future<RecipeChatSession> openSession(String recipeId) async {
    final savedSessionId = await _sessions.read(recipeId);
    if (savedSessionId != null) {
      try {
        final messages = await getMessages(savedSessionId);
        return RecipeChatSession(id: savedSessionId, messages: messages);
      } on ApiException catch (error) {
        if (error.statusCode != 404) rethrow;
        await _sessions.delete(recipeId);
      }
    }

    final sessionId = await createSession(recipeId);
    return RecipeChatSession(id: sessionId);
  }

  @override
  Future<String> createSession(String recipeId) async {
    final data =
        await _api.post('/recipe-chat/sessions', data: {'recipeId': recipeId})
            as Map<String, dynamic>;
    final sessionId = data['id'] as String;
    await _sessions.save(recipeId, sessionId);
    return sessionId;
  }

  @override
  Future<List<RecipeChatMessage>> getMessages(String sessionId) async {
    final data = await _api.get('/recipe-chat/sessions/$sessionId/messages');
    return ((data as List?) ?? const [])
        .whereType<Map>()
        .map((item) => RecipeChatMessage.fromJson(item.cast<String, dynamic>()))
        .toList(growable: false);
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
