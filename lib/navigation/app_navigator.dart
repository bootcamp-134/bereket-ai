import 'package:flutter/material.dart';

class AppNavigator {
  static final key = GlobalKey<NavigatorState>();
  static bool _redirectScheduled = false;

  static void handleSessionExpired() {
    if (_redirectScheduled) return;
    _redirectScheduled = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      key.currentState?.pushNamedAndRemoveUntil('/login', (_) => false);
      _redirectScheduled = false;
    });
  }

  const AppNavigator._();
}
