class ApiResponse<T> {
  final T data;
  final Map<String, dynamic> meta;

  const ApiResponse({required this.data, this.meta = const {}});

  factory ApiResponse.fromBody(dynamic body) {
    if (body is Map && body.containsKey('data')) {
      return ApiResponse<T>(
        data: body['data'] as T,
        meta: (body['meta'] as Map?)?.cast<String, dynamic>() ?? const {},
      );
    }
    return ApiResponse<T>(data: body as T);
  }
}
