import 'package:flutter/material.dart';

import 'screens/forgot_password_screen.dart';
import 'navigation/app_navigator.dart';
import 'screens/recipe_catalog_screen.dart';
import 'screens/login_screen.dart';
import 'screens/profile_setup_screen.dart';
import 'screens/register_screen.dart';
import 'screens/welcome_screen.dart';
import 'screens/what_should_i_eat_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const BereketAiApp());
}

class BereketAiApp extends StatelessWidget {
  const BereketAiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: AppNavigator.key,
      title: 'BereketAI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const WelcomeScreen(),
      routes: {
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/forgot-password': (_) => const ForgotPasswordScreen(),
        '/profile-setup': (_) => const ProfileSetupScreen(),
        '/what-should-i-eat': (_) => const WhatShouldIEatScreen(),
        '/recipes': (_) => const RecipeCatalogScreen(),
      },
    );
  }
}
