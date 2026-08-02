import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bereket_ai_mobile/config/api_config.dart';
import 'package:bereket_ai_mobile/models/login_credentials.dart';
import 'package:bereket_ai_mobile/models/recommendation.dart';
import 'package:bereket_ai_mobile/network/api_client.dart';
import 'package:bereket_ai_mobile/services/http_auth_service.dart';
import 'package:bereket_ai_mobile/services/http_recipe_chat_service.dart';
import 'package:bereket_ai_mobile/services/http_recipe_service.dart';
import 'package:bereket_ai_mobile/services/http_recommendation_service.dart';
import 'package:bereket_ai_mobile/storage/token_storage.dart';
import 'package:bereket_ai_mobile/storage/recipe_chat_session_storage.dart';

void main() {
  test('login uses the v1 contract and stores both tokens', () async {
    final tokens = _MemoryTokenStorage();
    late RequestOptions request;
    final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            request = options;
            handler.resolve(
              Response(
                requestOptions: options,
                data: {
                  'data': {
                    'user': {
                      'id': 'user-1',
                      'email': 'demo@example.com',
                      'profileComplete': false,
                    },
                    'tokens': {
                      'accessToken': 'access-token',
                      'refreshToken': 'refresh-token',
                    },
                  },
                },
              ),
            );
          },
        ),
      );

    final service = HttpAuthService(ApiClient(dio: dio, tokenStorage: tokens));
    final result = await service.signIn(
      const LoginCredentials(
        identifier: 'demo@example.com',
        password: 'secret',
      ),
    );

    expect(result.isSuccess, isTrue);
    expect(request.uri.path, '/api/v1/auth/login');
    expect(request.data, {'email': 'demo@example.com', 'password': 'secret'});
    expect(await tokens.readAccessToken(), 'access-token');
    expect(await tokens.readRefreshToken(), 'refresh-token');
  });

  test(
    'recommendations map recipe data and expose AI fallback metadata',
    () async {
      final tokens = _MemoryTokenStorage()
        ..accessToken = 'access-token'
        ..refreshToken = 'refresh-token';
      final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
        ..interceptors.add(
          InterceptorsWrapper(
            onRequest: (options, handler) => handler.resolve(
              Response(
                requestOptions: options,
                data: {
                  'data': {
                    'results': [
                      {
                        'recipe': {
                          'id': 'recipe-1',
                          'title': 'Mercimek Çorbası',
                          'description': 'Sıcak bir çorba',
                          'preparationMinutes': 15,
                          'difficulty': 'kolay',
                          'ingredients': [
                            {'name': 'Mercimek', 'amountText': '1 su bardağı'},
                            {'name': 'Soğan', 'amountText': '1 adet'},
                          ],
                          'steps': [
                            {'order': 1, 'text': 'Malzemeleri hazırla.'},
                          ],
                        },
                        'matchPercentage': 50,
                        'missingIngredients': ['Soğan'],
                        'estimatedAdditionalCostTry': 12.5,
                        'reason': 'Bütçeye uygun.',
                      },
                    ],
                    'noResultsReason': null,
                    'generatedBy': 'deterministic',
                    'fallback': true,
                  },
                },
              ),
            ),
          ),
        );
      final service = HttpRecommendationService(
        ApiClient(dio: dio, tokenStorage: tokens),
      );

      final batch = await service.recommend(
        const RecommendationRequest(
          availableIngredients: ['Mercimek'],
          wantsToShop: true,
          budget: 100,
        ),
      );

      expect(batch.fallback, isTrue);
      expect(batch.recommendations.single.recipe.title, 'Mercimek Çorbası');
      expect(
        batch.recommendations.single.matchedIngredients.single.name,
        'Mercimek',
      );
      expect(batch.recommendations.single.estimatedExtraCost, 12.5);
    },
  );

  test('unknown recommendation costs remain null', () async {
    final tokens = _MemoryTokenStorage()..accessToken = 'access-token';
    final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) => handler.resolve(
            Response(
              requestOptions: options,
              data: {
                'data': {
                  'results': [
                    {
                      'recipe': {
                        'id': 'recipe-unknown-cost',
                        'title': 'Maliyeti Belirsiz Tarif',
                        'ingredients': <Object>[],
                        'steps': <Object>[],
                      },
                      'matchPercentage': 80,
                      'missingIngredients': ['Özel malzeme'],
                      'estimatedAdditionalCostTry': null,
                      'reason': 'Fiyat verisi eksik.',
                    },
                  ],
                  'generatedBy': 'deterministic',
                  'fallback': false,
                },
              },
            ),
          ),
        ),
      );
    final service = HttpRecommendationService(
      ApiClient(dio: dio, tokenStorage: tokens),
    );

    final batch = await service.recommend(
      const RecommendationRequest(
        availableIngredients: ['Domates'],
        wantsToShop: true,
        budget: 100,
      ),
    );

    expect(batch.recommendations.single.estimatedExtraCost, isNull);
  });

  test('recipe list and detail use production endpoints', () async {
    final tokens = _MemoryTokenStorage()..accessToken = 'access-token';
    final requestedPaths = <String>[];
    final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            requestedPaths.add(options.uri.path);
            final recipe = {
              'id': 'recipe-1',
              'title': 'Sebze Yemeği',
              'ingredients': <Object>[],
              'steps': <Object>[],
              'estimatedCost': {
                'amountTry': 85.5,
                'isPartial': true,
                'coverageRatio': 0.7,
                'label': 'Tahminî maliyet',
              },
            };
            handler.resolve(
              Response(
                requestOptions: options,
                data: {
                  'data': options.uri.path.endsWith('/recipes')
                      ? [recipe]
                      : recipe,
                },
              ),
            );
          },
        ),
      );
    final service = HttpRecipeService(
      ApiClient(dio: dio, tokenStorage: tokens),
    );

    final page = await service.listRecipes(search: 'sebze');
    final detail = await service.getRecipe('recipe-1');

    expect(page.recipes.single.title, 'Sebze Yemeği');
    expect(detail.estimatedCost.amountTry, 85.5);
    expect(detail.estimatedCost.isPartial, isTrue);
    expect(requestedPaths, ['/api/v1/recipes', '/api/v1/recipes/recipe-1']);
  });

  test('chat history maps persisted messages', () async {
    final tokens = _MemoryTokenStorage()..accessToken = 'access-token';
    final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) => handler.resolve(
            Response(
              requestOptions: options,
              data: {
                'data': [
                  {
                    'id': 'message-1',
                    'role': 'user',
                    'content': 'İlk adım nedir?',
                    'fallback': false,
                    'createdAt': '2026-08-02T10:00:00.000Z',
                  },
                  {
                    'id': 'message-2',
                    'role': 'assistant',
                    'content': 'Malzemeleri hazırla.',
                    'fallback': true,
                    'createdAt': '2026-08-02T10:00:01.000Z',
                  },
                ],
              },
            ),
          ),
        ),
      );
    final service = HttpRecipeChatService(
      ApiClient(dio: dio, tokenStorage: tokens),
    );

    final messages = await service.getMessages('session-1');

    expect(messages, hasLength(2));
    expect(messages.first.role, 'user');
    expect(messages.last.fallback, isTrue);
  });

  test(
    'recipe chat reopens the saved session and restores its history',
    () async {
      final tokens = _MemoryTokenStorage()..accessToken = 'access-token';
      final sessions = _MemoryRecipeChatSessionStorage();
      var createCalls = 0;
      var historyCalls = 0;
      final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
        ..interceptors.add(
          InterceptorsWrapper(
            onRequest: (options, handler) {
              if (options.method == 'POST' &&
                  options.uri.path.endsWith('/recipe-chat/sessions')) {
                createCalls++;
                handler.resolve(
                  Response(
                    requestOptions: options,
                    data: {
                      'data': {'id': 'session-1'},
                    },
                  ),
                );
                return;
              }
              historyCalls++;
              handler.resolve(
                Response(
                  requestOptions: options,
                  data: {
                    'data': [
                      {
                        'id': 'message-1',
                        'role': 'user',
                        'content': 'Nasıl başlarım?',
                        'fallback': false,
                        'createdAt': '2026-08-02T10:00:00.000Z',
                      },
                    ],
                  },
                ),
              );
            },
          ),
        );
      final service = HttpRecipeChatService(
        ApiClient(dio: dio, tokenStorage: tokens),
        sessionStorage: sessions,
      );

      final firstOpen = await service.openSession('recipe-1');
      final secondOpen = await service.openSession('recipe-1');

      expect(firstOpen.id, 'session-1');
      expect(firstOpen.messages, isEmpty);
      expect(secondOpen.id, 'session-1');
      expect(secondOpen.messages.single.content, 'Nasıl başlarım?');
      expect(createCalls, 1);
      expect(historyCalls, 1);
    },
  );

  test('concurrent 401s share one failed refresh and log out once', () async {
    final tokens = _MemoryTokenStorage()
      ..accessToken = 'expired-access'
      ..refreshToken = 'expired-refresh';
    var refreshCalls = 0;
    var logoutCalls = 0;
    final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl))
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            if (options.uri.path.endsWith('/auth/refresh')) refreshCalls++;
            handler.reject(
              DioException(
                requestOptions: options,
                response: Response(
                  requestOptions: options,
                  statusCode: 401,
                  data: {
                    'error': {
                      'code': 'UNAUTHORIZED',
                      'message': 'Oturum sona erdi.',
                    },
                  },
                ),
              ),
            );
          },
        ),
      );
    final api = ApiClient(
      dio: dio,
      tokenStorage: tokens,
      onSessionExpired: () => logoutCalls++,
    );

    final results = await Future.wait(
      [
        api.get('/me'),
        api.get('/recipes'),
      ].map((request) => request.then((_) => false).catchError((_) => true)),
    );

    expect(results, everyElement(isTrue));
    expect(refreshCalls, 1);
    expect(logoutCalls, 1);
    expect(await tokens.readAccessToken(), isNull);
    expect(await tokens.readRefreshToken(), isNull);
  });
}

class _MemoryTokenStorage implements TokenStorage {
  String? accessToken;
  String? refreshToken;

  @override
  Future<void> clear() async {
    accessToken = null;
    refreshToken = null;
  }

  @override
  Future<String?> readAccessToken() async => accessToken;

  @override
  Future<String?> readRefreshToken() async => refreshToken;

  @override
  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

class _MemoryRecipeChatSessionStorage implements RecipeChatSessionStorage {
  final _sessions = <String, String>{};

  @override
  Future<void> delete(String recipeId) async => _sessions.remove(recipeId);

  @override
  Future<String?> read(String recipeId) async => _sessions[recipeId];

  @override
  Future<void> save(String recipeId, String sessionId) async {
    _sessions[recipeId] = sessionId;
  }
}
