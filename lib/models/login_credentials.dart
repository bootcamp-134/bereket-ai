class LoginCredentials {
  final String identifier;
  final String password;

  const LoginCredentials({required this.identifier, required this.password});
}

class AuthResult {
  final bool isSuccess;
  final String message;

  const AuthResult._({required this.isSuccess, required this.message});

  const AuthResult.success(String message)
    : this._(isSuccess: true, message: message);

  const AuthResult.failure(String message)
    : this._(isSuccess: false, message: message);
}

class RegistrationDetails {
  final String fullName;
  final String email;
  final String password;

  const RegistrationDetails({
    required this.fullName,
    required this.email,
    required this.password,
  });
}
