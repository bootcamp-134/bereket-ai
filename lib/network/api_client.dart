import 'package:dio/dio.dart';

import '../config/api_config.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

class ApiClient {
  final Dio _dio;
  final TokenStorage _tokens;
  Future<bool>? _refreshInFlight;

  ApiClient({Dio? dio, TokenStorage? tokenStorage})
    : _dio =
          dio ??
          Dio(
            BaseOptions(
              baseUrl: ApiConfig.baseUrl.endsWith('/')
                  ? ApiConfig.baseUrl
                  : '${ApiConfig.baseUrl}/',
              connectTimeout: const Duration(seconds: 15),
              receiveTimeout: const Duration(seconds: 45),
              sendTimeout: const Duration(seconds: 15),
              headers: const {'Accept': 'application/json'},
            ),
          ),
      _tokens = tokenStorage ?? const SecureTokenStorage();

  TokenStorage get tokenStorage => _tokens;

  Future<dynamic> get(String path, {Map<String, dynamic>? query}) =>
      _request('GET', path, query: query);

  Future<dynamic> post(
    String path, {
    Object? data,
    bool authenticated = true,
  }) => _request('POST', path, data: data, authenticated: authenticated);

  Future<dynamic> patch(String path, {Object? data}) =>
      _request('PATCH', path, data: data);

  Future<dynamic> _request(
    String method,
    String path, {
    Object? data,
    Map<String, dynamic>? query,
    bool authenticated = true,
    bool allowRefresh = true,
  }) async {
    try {
      final accessToken = authenticated
          ? await _tokens.readAccessToken()
          : null;
      final response = await _dio.request<dynamic>(
        _relative(path),
        data: data,
        queryParameters: query,
        options: Options(
          method: method,
          contentType: Headers.jsonContentType,
          headers: accessToken == null
              ? null
              : {'Authorization': 'Bearer $accessToken'},
        ),
      );
      return _unwrap(response.data);
    } on DioException catch (error) {
      if (authenticated && allowRefresh && error.response?.statusCode == 401) {
        final refreshed = await _refreshOnce();
        if (refreshed) {
          return _request(
            method,
            path,
            data: data,
            query: query,
            authenticated: true,
            allowRefresh: false,
          );
        }
      }
      throw _toApiException(error);
    }
  }

  Future<bool> _refreshOnce() {
    final active = _refreshInFlight;
    if (active != null) return active;

    final refresh = _refresh();
    _refreshInFlight = refresh;
    return refresh.whenComplete(() => _refreshInFlight = null);
  }

  Future<bool> _refresh() async {
    final refreshToken = await _tokens.readRefreshToken();
    if (refreshToken == null) return false;
    try {
      final response = await _dio.post<dynamic>(
        _relative('/auth/refresh'),
        data: {'refreshToken': refreshToken},
        options: Options(contentType: Headers.jsonContentType),
      );
      final data = _unwrap(response.data) as Map<String, dynamic>;
      final tokenData =
          (data['tokens'] as Map?)?.cast<String, dynamic>() ?? data;
      await _tokens.saveTokens(
        accessToken: tokenData['accessToken'] as String,
        refreshToken: tokenData['refreshToken'] as String,
      );
      return true;
    } catch (_) {
      await _tokens.clear();
      return false;
    }
  }

  dynamic _unwrap(dynamic body) {
    if (body is Map && body.containsKey('data')) return body['data'];
    return body;
  }

  String _relative(String path) =>
      path.startsWith('/') ? path.substring(1) : path;

  ApiException _toApiException(DioException error) {
    final body = error.response?.data;
    final errorBody = body is Map ? body['error'] : null;
    final details = errorBody is Map ? errorBody : const <String, dynamic>{};
    final message =
        details['message']?.toString() ??
        (error.type == DioExceptionType.connectionTimeout ||
                error.type == DioExceptionType.connectionError
            ? 'Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.'
            : 'İstek tamamlanamadı. Lütfen tekrar dene.');
    return ApiException(
      code: details['code']?.toString() ?? 'NETWORK_ERROR',
      message: message,
      statusCode: error.response?.statusCode,
      requestId: details['requestId']?.toString(),
    );
  }
}
