class ApiConfig {
  static const baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.bereket.app/api/v1/',
  );

  const ApiConfig._();
}
