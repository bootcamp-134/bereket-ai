import 'package:flutter/material.dart';

import '../models/recipe.dart';
import '../services/mock_recipe_assistant_service.dart';
import '../theme/app_theme.dart';

class RecipeAssistantScreen extends StatefulWidget {
  final Recipe recipe;

  const RecipeAssistantScreen({super.key, required this.recipe});

  @override
  State<RecipeAssistantScreen> createState() => _RecipeAssistantScreenState();
}

class _RecipeAssistantScreenState extends State<RecipeAssistantScreen> {
  static const List<String> _quickQuestions = [
    'İlk adım nedir?',
    'Hangi malzemeler gerekli?',
    'Tarif ne kadar sürer?',
    'Eksik malzeme yerine ne kullanabilirim?',
  ];

  final MockRecipeAssistantService _assistantService =
      const MockRecipeAssistantService();
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [];

  bool _isReplying = false;

  @override
  void initState() {
    super.initState();
    _messages.add(
      _ChatMessage(
        text:
            '${widget.recipe.title} tarifini hazırlarken sana yardımcı '
            'olabilirim. Malzemeler, hazırlanış veya süre hakkında '
            'bir soru sorabilirsin.',
        isUser: false,
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _sendMessage([String? quickQuestion]) async {
    if (_isReplying) {
      return;
    }

    final question = _assistantService.cleanQuestion(
      quickQuestion ?? _messageController.text,
    );

    if (question.isEmpty) {
      return;
    }

    if (question.length > MockRecipeAssistantService.maxQuestionLength) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sorunuz en fazla 300 karakter olabilir.'),
        ),
      );
      return;
    }

    _messageController.clear();
    FocusScope.of(context).unfocus();

    setState(() {
      _messages.add(_ChatMessage(text: question, isUser: true));
      _isReplying = true;
    });
    _scrollToBottom();

    try {
      final reply = await _assistantService.getReply(
        recipe: widget.recipe,
        question: question,
      );

      if (!mounted) {
        return;
      }

      setState(() {
        _messages.add(_ChatMessage(text: reply, isUser: false));
      });
    } catch (_) {
      if (!mounted) {
        return;
      }

      setState(() {
        _messages.add(
          const _ChatMessage(
            text: 'Şu anda cevap oluşturulamıyor. Lütfen tekrar deneyin.',
            isUser: false,
          ),
        );
      });
    } finally {
      if (mounted) {
        setState(() {
          _isReplying = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) {
        return;
      }

      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        titleSpacing: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tarif Yardımcısı',
              style: TextStyle(
                color: AppColors.ink,
                fontSize: 19,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              widget.recipe.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.mutedInk,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        top: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 620),
            child: Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
                    itemCount: _messages.length + (_isReplying ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (_isReplying && index == _messages.length) {
                        return const _TypingIndicator();
                      }
                      return _MessageBubble(message: _messages[index]);
                    },
                  ),
                ),
                _buildComposer(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildComposer() {
    return Container(
      padding: EdgeInsets.fromLTRB(
        16,
        12,
        16,
        12 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      decoration: const BoxDecoration(
        color: AppColors.cream,
        border: Border(top: BorderSide(color: AppColors.outline)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _quickQuestions.map((question) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    label: Text(question),
                    avatar: const Icon(
                      Icons.auto_awesome_rounded,
                      size: 16,
                      color: AppColors.forest,
                    ),
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.outline),
                    onPressed: _isReplying
                        ? null
                        : () => _sendMessage(question),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: TextField(
                  key: const Key('assistant-message-field'),
                  controller: _messageController,
                  enabled: !_isReplying,
                  minLines: 1,
                  maxLines: 3,
                  maxLength: MockRecipeAssistantService.maxQuestionLength,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _sendMessage(),
                  decoration: const InputDecoration(
                    hintText: 'Tarifle ilgili bir şey sor...',
                    counterText: '',
                    prefixIcon: Icon(Icons.chat_bubble_outline_rounded),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              SizedBox(
                width: 54,
                height: 54,
                child: IconButton.filled(
                  key: const Key('assistant-send-button'),
                  tooltip: 'Gönder',
                  onPressed: _isReplying ? null : _sendMessage,
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.forest,
                    foregroundColor: Colors.white,
                    disabledBackgroundColor: AppColors.forest.withValues(
                      alpha: 0.50,
                    ),
                  ),
                  icon: _isReplying
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.3,
                          ),
                        )
                      : const Icon(Icons.send_rounded),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool isUser;

  const _ChatMessage({required this.text, required this.isUser});
}

class _MessageBubble extends StatelessWidget {
  final _ChatMessage message;

  const _MessageBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 460),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        decoration: BoxDecoration(
          color: message.isUser ? AppColors.forest : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(18),
            topRight: const Radius.circular(18),
            bottomLeft: Radius.circular(message.isUser ? 18 : 4),
            bottomRight: Radius.circular(message.isUser ? 4 : 18),
          ),
          border: message.isUser ? null : Border.all(color: AppColors.outline),
        ),
        child: Text(
          message.text,
          style: TextStyle(
            color: message.isUser ? Colors.white : AppColors.ink,
            height: 1.45,
          ),
        ),
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.outline),
        ),
        child: const SizedBox(
          width: 18,
          height: 18,
          child: CircularProgressIndicator(
            color: AppColors.forest,
            strokeWidth: 2.2,
          ),
        ),
      ),
    );
  }
}
