import '../models/login_credentials.dart';
import '../network/api_client.dart';
import '../network/api_exception.dart';
import 'auth_service.dart';

class HttpAuthService implements AuthService {
  final ApiClient _api;

  HttpAuthService(this._api);

  @override
  Future<AuthResult> signIn(LoginCredentials credentials) async {
    try {
      final data =
          await _api.post(
                '/auth/login',
                authenticated: false,
                data: {
                  'email': credentials.identifier,
                  'password': credentials.password,
                },
              )
              as Map<String, dynamic>;
      await _saveTokens(data);
      return const AuthResult.success('Giriş başarılı.');
    } on ApiException catch (error) {
      return AuthResult.failure(error.message);
    }
  }

  @override
  Future<AuthResult> register(RegistrationDetails details) async {
    try {
      final data =
          await _api.post(
                '/auth/register',
                authenticated: false,
                data: {
                  'email': details.email,
                  'fullName': details.fullName,
                  'password': details.password,
                },
              )
              as Map<String, dynamic>;
      await _saveTokens(data);
      return const AuthResult.success('Kayıt başarılı.');
    } on ApiException catch (error) {
      return AuthResult.failure(error.message);
    }
  }

  Future<void> _saveTokens(Map<String, dynamic> data) async {
    final tokens = (data['tokens'] as Map).cast<String, dynamic>();
    await _api.tokenStorage.saveTokens(
      accessToken: tokens['accessToken'] as String,
      refreshToken: tokens['refreshToken'] as String,
    );
  }

  @override
  Future<void> requestPasswordReset(String email) => _api.post(
    '/auth/forgot-password',
    authenticated: false,
    data: {'email': email},
  );

  @override
  Future<void> resetPassword({
    required String token,
    required String password,
  }) => _api.post(
    '/auth/reset-password',
    authenticated: false,
    data: {'token': token, 'password': password},
  );

  @override
  Future<void> signOut() async {
    try {
      await _api.post('/auth/logout');
    } finally {
      await _api.tokenStorage.clear();
    }
  }
}
