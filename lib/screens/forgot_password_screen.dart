import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../widgets/app_text_field.dart';
import '../widgets/brand_mark.dart';
import '../widgets/primary_button.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();

  bool _isLoading = false;
  bool _emailSent = false;

  Future<void> _sendResetLink() async {
    FocusManager.instance.primaryFocus?.unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;

    setState(() => _isLoading = true);
    await Future<void>.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    setState(() {
      _isLoading = false;
      _emailSent = true;
    });
  }

  String? _validateEmail(String? value) {
    final email = value?.trim() ?? '';
    if (email.isEmpty) return 'E-posta adresini gir.';
    if (!email.contains('@') || !email.contains('.')) {
      return 'Geçerli bir e-posta adresi gir.';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        leadingWidth: 72,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: IconButton.filledTonal(
            tooltip: 'Geri',
            onPressed: () => Navigator.of(context).pop(),
            icon: const Icon(Icons.arrow_back_rounded),
          ),
        ),
      ),
      body: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 28, 24, 30),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Align(child: BrandMark(size: 72)),
                    const SizedBox(height: 28),
                    Text(
                      'Şifreni yenile',
                      textAlign: TextAlign.center,
                      style: theme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Hesabına bağlı e-posta adresini yaz. Sana şifre yenileme bağlantısı gönderelim.',
                      textAlign: TextAlign.center,
                      style: theme.textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 34),
                    if (_emailSent) ...[
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: AppColors.sage,
                          borderRadius: BorderRadius.circular(AppRadii.card),
                          border: Border.all(
                            color: AppColors.leaf.withValues(alpha: 0.35),
                          ),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.mark_email_read_outlined,
                              size: 42,
                              color: AppColors.forest,
                            ),
                            const SizedBox(height: 12),
                            const Text(
                              'Yenileme bağlantısı gönderildi',
                              style: TextStyle(
                                color: AppColors.ink,
                                fontSize: 18,
                                height: 1.30,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _emailController.text.trim(),
                              textAlign: TextAlign.center,
                              style: const TextStyle(color: AppColors.mutedInk),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),
                    ],
                    AppTextField(
                      controller: _emailController,
                      label: 'E-posta',
                      hint: 'ornek@eposta.com',
                      prefixIcon: Icons.mail_outline_rounded,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.done,
                      autofillHints: const [AutofillHints.email],
                      maxLength: 254,
                      validator: _validateEmail,
                      onFieldSubmitted: (_) => _sendResetLink(),
                    ),
                    const SizedBox(height: 20),
                    PrimaryButton(
                      key: const Key('forgot-submit-button'),
                      label: _emailSent
                          ? 'Tekrar Gönder'
                          : 'Yenileme Bağlantısı Gönder',
                      icon: Icons.send_rounded,
                      isLoading: _isLoading,
                      onPressed: _sendResetLink,
                    ),
                    const SizedBox(height: 14),
                    TextButton.icon(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.arrow_back_rounded, size: 18),
                      label: const Text('Giriş ekranına dön'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }
}
