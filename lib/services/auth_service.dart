import '../models/login_credentials.dart';

abstract interface class AuthService {
  Future<AuthResult> signIn(LoginCredentials credentials);
  Future<AuthResult> register(RegistrationDetails details);
  Future<void> requestPasswordReset(String email);
  Future<void> resetPassword({required String token, required String password});
  Future<void> signOut();
}

class DemoAuthService implements AuthService {
  const DemoAuthService();

  @override
  Future<AuthResult> signIn(LoginCredentials credentials) async {
    await Future<void>.delayed(const Duration(milliseconds: 850));

    final isDemoAccount =
        credentials.identifier.toLowerCase() == 'demo@bereket.ai' &&
        credentials.password == 'bereket123';

    if (isDemoAccount) {
      return const AuthResult.success('Giriş başarılı.');
    }

    return const AuthResult.failure(
      'E-posta veya şifre hatalı. Bilgilerini kontrol edip tekrar dene.',
    );
  }

  @override
  Future<AuthResult> register(RegistrationDetails details) async =>
      const AuthResult.success('Kayıt başarılı.');

  @override
  Future<void> requestPasswordReset(String email) async {}

  @override
  Future<void> resetPassword({
    required String token,
    required String password,
  }) async {}

  @override
  Future<void> signOut() async {}
}
