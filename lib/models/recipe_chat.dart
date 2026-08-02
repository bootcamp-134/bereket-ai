class RecipeChatReply {
  final String content;
  final bool fallback;
  final List<String> warnings;

  const RecipeChatReply({
    required this.content,
    required this.fallback,
    this.warnings = const [],
  });
}

class RecipeChatMessage {
  final String id;
  final String role;
  final String content;
  final bool fallback;
  final DateTime? createdAt;

  const RecipeChatMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.fallback,
    this.createdAt,
  });

  factory RecipeChatMessage.fromJson(Map<String, dynamic> json) =>
      RecipeChatMessage(
        id: json['id']?.toString() ?? '',
        role: json['role']?.toString() ?? 'assistant',
        content: json['content']?.toString() ?? '',
        fallback: json['fallback'] == true,
        createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? ''),
      );
}

class RecipeChatSession {
  final String id;
  final List<RecipeChatMessage> messages;

  const RecipeChatSession({required this.id, this.messages = const []});
}
