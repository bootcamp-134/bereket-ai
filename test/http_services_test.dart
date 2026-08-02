import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bereket_ai_mobile/config/api_config.dart';
import 'package:bereket_ai_mobile/models/login_credentials.dart';
import 'package:bereket_ai_mobile/models/recommendation.dart';
import 'package:bereket_ai_mobile/network/api_client.dart';
import 'package:bereket_ai_mobile/services/http_auth_service.dart';
import 'package:bereket_ai_mobile/services/http_recommendation_service.dart';
import 'package:bereket_ai_mobile/storage/token_storage.dart';

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
