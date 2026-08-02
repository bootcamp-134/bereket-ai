import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract interface class RecipeChatSessionStorage {
  Future<String?> read(String recipeId);
  Future<void> save(String recipeId, String sessionId);
  Future<void> delete(String recipeId);
}

class SecureRecipeChatSessionStorage implements RecipeChatSessionStorage {
  static const _prefix = 'bereket_recipe_chat_session_';
  final FlutterSecureStorage _storage;

  const SecureRecipeChatSessionStorage({
    FlutterSecureStorage storage = const FlutterSecureStorage(),
  }) : _storage = storage;

  String _key(String recipeId) => '$_prefix$recipeId';

  @override
  Future<String?> read(String recipeId) => _storage.read(key: _key(recipeId));

  @override
  Future<void> save(String recipeId, String sessionId) =>
      _storage.write(key: _key(recipeId), value: sessionId);

  @override
  Future<void> delete(String recipeId) => _storage.delete(key: _key(recipeId));
}
