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
