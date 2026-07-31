import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../widgets/app_text_field.dart';
import '../widgets/brand_mark.dart';
import '../widgets/primary_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmation = true;
  bool _acceptedTerms = false;
  bool _isLoading = false;

  Future<void> _register() async {
    FocusManager.instance.primaryFocus?.unfocus();

    if (!(_formKey.currentState?.validate() ?? false)) return;
    if (!_acceptedTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Devam etmek için koşulları kabul et.')),
      );
      return;
    }

    setState(() => _isLoading = true);
    await Future<void>.delayed(const Duration(milliseconds: 850));

    if (!mounted) return;
    setState(() => _isLoading = false);
    Navigator.of(context).pushReplacementNamed('/profile-setup');
  }

  String? _validateName(String? value) {
    if ((value?.trim().length ?? 0) < 2) {
      return 'Adını ve soyadını gir.';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    final email = value?.trim() ?? '';
    if (email.isEmpty) return 'E-posta adresini gir.';
    if (!email.contains('@') || !email.contains('.')) {
      return 'Geçerli bir e-posta adresi gir.';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.length < 6) {
      return 'Şifre en az 6 karakter olmalı.';
    }
    return null;
  }

  String? _validateConfirmation(String? value) {
    if (value != _passwordController.text) {
      return 'Şifreler birbiriyle eşleşmiyor.';
    }
    return null;
  }

  void _openLogin() {
    Navigator.of(context).pushReplacementNamed('/login');
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
          padding: const EdgeInsets.fromLTRB(24, 4, 24, 30),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: AutofillGroup(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Align(child: BrandMark(size: 66)),
                      const SizedBox(height: 22),
                      Text(
                        'Hesabını oluştur',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Evdeki malzemelerini ve bütçeni tarif önerilerinde kullan.',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyLarge,
                      ),
                      const SizedBox(height: 28),
                      AppTextField(
                        controller: _nameController,
                        label: 'Ad ve soyad',
                        hint: 'Adını gir',
                        prefixIcon: Icons.badge_outlined,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.name],
                        maxLength: 60,
                        textCapitalization: TextCapitalization.words,
                        validator: _validateName,
                      ),
                      const SizedBox(height: 14),
                      AppTextField(
                        controller: _emailController,
                        label: 'E-posta',
                        hint: 'ornek@eposta.com',
                        prefixIcon: Icons.mail_outline_rounded,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.newUsername],
                        maxLength: 254,
                        validator: _validateEmail,
                      ),
                      const SizedBox(height: 14),
                      AppTextField(
                        controller: _passwordController,
                        label: 'Şifre',
                        hint: 'En az 6 karakter',
                        prefixIcon: Icons.lock_outline_rounded,
                        obscureText: _obscurePassword,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.newPassword],
                        maxLength: 128,
                        validator: _validatePassword,
                        suffixIcon: IconButton(
                          tooltip: _obscurePassword
                              ? 'Şifreyi göster'
                              : 'Şifreyi gizle',
                          onPressed: () => setState(
                            () => _obscurePassword = !_obscurePassword,
                          ),
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      AppTextField(
                        controller: _confirmPasswordController,
                        label: 'Şifreyi doğrula',
                        hint: 'Şifreni tekrar gir',
                        prefixIcon: Icons.verified_user_outlined,
                        obscureText: _obscureConfirmation,
                        textInputAction: TextInputAction.done,
                        autofillHints: const [AutofillHints.newPassword],
                        maxLength: 128,
                        validator: _validateConfirmation,
                        onFieldSubmitted: (_) => _register(),
                        suffixIcon: IconButton(
                          tooltip: _obscureConfirmation
                              ? 'Şifreyi göster'
                              : 'Şifreyi gizle',
                          onPressed: () => setState(
                            () => _obscureConfirmation = !_obscureConfirmation,
                          ),
                          icon: Icon(
                            _obscureConfirmation
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      CheckboxListTile(
                        value: _acceptedTerms,
                        onChanged: (value) {
                          setState(() => _acceptedTerms = value ?? false);
                        },
                        activeColor: AppColors.forest,
                        contentPadding: EdgeInsets.zero,
                        controlAffinity: ListTileControlAffinity.leading,
                        title: const Text(
                          'Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.',
                          style: TextStyle(fontSize: 12, height: 1.40),
                        ),
                      ),
                      const SizedBox(height: 12),
                      PrimaryButton(
                        key: const Key('register-submit-button'),
                        label: 'Kayıt Ol',
                        icon: Icons.arrow_forward_rounded,
                        isLoading: _isLoading,
                        onPressed: _register,
                      ),
                      const SizedBox(height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Zaten hesabın var mı?',
                            style: TextStyle(color: AppColors.mutedInk),
                          ),
                          TextButton(
                            onPressed: _openLogin,
                            child: const Text('Giriş Yap'),
                          ),
                        ],
                      ),
                    ],
                  ),
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
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
