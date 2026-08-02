class ApiException implements Exception {
  final String code;
  final String message;
  final int? statusCode;
  final String? requestId;

  const ApiException({
    required this.code,
    required this.message,
    this.statusCode,
    this.requestId,
  });

  @override
  String toString() => message;
}
