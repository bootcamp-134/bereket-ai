import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/login_credentials.dart';
import '../services/app_services.dart';
import '../services/auth_service.dart';
import '../testing/app_semantics.dart';
import '../theme/app_theme.dart';
import '../widgets/app_text_field.dart';
import '../widgets/brand_mark.dart';
import '../widgets/primary_button.dart';

class LoginScreen extends StatefulWidget {
  final AuthService? authService;

  const LoginScreen({super.key, this.authService});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  late final AuthService _authService;

  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _rememberMe = true;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AppServices.instance.auth;
  }

  Future<void> _attemptLogin() async {
    FocusManager.instance.primaryFocus?.unfocus();

    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    setState(() => _isLoading = true);

    final credentials = LoginCredentials(
      identifier: _identifierController.text.trim(),
      password: _passwordController.text,
    );
    final result = await _authService.signIn(credentials);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result.isSuccess) {
      TextInput.finishAutofillContext();
      Navigator.of(context).pushReplacementNamed('/profile-setup');
      return;
    }

    ScaffoldMessenger.of(context)
      ..clearSnackBars()
      ..showSnackBar(
        SnackBar(
          backgroundColor: AppColors.error,
          content: Row(
            children: [
              const Icon(Icons.error_outline_rounded, color: Colors.white),
              const SizedBox(width: 12),
              Expanded(child: Text(result.message)),
            ],
          ),
        ),
      );
  }

  String? _validateIdentifier(String? value) {
    final identifier = value?.trim() ?? '';
    if (identifier.isEmpty) {
      return 'E-posta adresini gir.';
    }
    if (!identifier.contains('@') || !identifier.contains('.')) {
      return 'Geçerli bir e-posta adresi gir.';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifreni gir.';
    }
    if (value.length < 6) {
      return 'Şifre en az 6 karakter olmalı.';
    }
    return null;
  }

  void _openForgotPassword() {
    Navigator.of(context).pushNamed('/forgot-password');
  }

  void _openRegistration() {
    Navigator.of(context).pushNamed('/register');
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
          padding: const EdgeInsets.fromLTRB(24, 10, 24, 30),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: AutofillGroup(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Align(child: BrandMark(size: 72)),
                      const SizedBox(height: 26),
                      Text(
                        'Tekrar hoş geldin',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Evdeki malzemelerinle bütçene uygun tarifleri bul.',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyLarge,
                      ),
                      const SizedBox(height: 34),
                      AppTextField(
                        semanticIdentifier: AppSemantics.loginIdentifier,
                        controller: _identifierController,
                        label: 'E-posta',
                        hint: 'ornek@eposta.com',
                        prefixIcon: Icons.person_outline_rounded,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [
                          AutofillHints.username,
                          AutofillHints.email,
                        ],
                        maxLength: 254,
                        validator: _validateIdentifier,
                      ),
                      const SizedBox(height: 16),
                      AppTextField(
                        semanticIdentifier: AppSemantics.loginPassword,
                        controller: _passwordController,
                        label: 'Şifre',
                        hint: 'Şifreni gir',
                        prefixIcon: Icons.lock_outline_rounded,
                        obscureText: _obscurePassword,
                        textInputAction: TextInputAction.done,
                        autofillHints: const [AutofillHints.password],
                        maxLength: 128,
                        validator: _validatePassword,
                        onFieldSubmitted: (_) => _attemptLogin(),
                        suffixIcon: IconButton(
                          tooltip: _obscurePassword
                              ? 'Şifreyi göster'
                              : 'Şifreyi gizle',
                          onPressed: () {
                            setState(
                              () => _obscurePassword = !_obscurePassword,
                            );
                          },
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Checkbox(
                            value: _rememberMe,
                            activeColor: AppColors.forest,
                            onChanged: (value) {
                              setState(() => _rememberMe = value ?? false);
                            },
                          ),
                          const Text(
                            'Beni hatırla',
                            style: TextStyle(
                              color: AppColors.ink,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const Spacer(),
                          Semantics(
                            identifier: AppSemantics.forgotPassword,
                            child: TextButton(
                              onPressed: _openForgotPassword,
                              child: const Text('Şifremi unuttum'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      PrimaryButton(
                        key: const Key('login-submit-button'),
                        semanticIdentifier: AppSemantics.loginSubmit,
                        label: 'Giriş Yap',
                        icon: Icons.arrow_forward_rounded,
                        isLoading: _isLoading,
                        onPressed: _attemptLogin,
                      ),
                      const SizedBox(height: 22),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Hesabın yok mu?',
                            style: TextStyle(color: AppColors.mutedInk),
                          ),
                          TextButton(
                            onPressed: _openRegistration,
                            child: const Text('Kayıt Ol'),
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
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
