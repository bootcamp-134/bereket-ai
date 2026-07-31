import 'package:bereket_ai_mobile/theme/app_theme.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('typography uses a deliberate scale with readable line heights', () {
    final textTheme = AppTheme.light.textTheme;

    expect(textTheme.bodySmall?.fontSize, 12);
    expect(textTheme.bodyMedium?.fontSize, 14);
    expect(textTheme.bodyLarge?.fontSize, 16);
    expect(textTheme.titleLarge?.fontSize, 18);
    expect(textTheme.headlineMedium?.fontSize, 24);
    expect(textTheme.displaySmall?.fontSize, 32);

    for (final style in [
      textTheme.bodySmall,
      textTheme.bodyMedium,
      textTheme.bodyLarge,
      textTheme.titleLarge,
      textTheme.headlineMedium,
      textTheme.displaySmall,
    ]) {
      expect(style?.height, greaterThanOrEqualTo(1.2));
    }
  });

  test('controls and cards use the shared radius budget', () {
    expect(AppRadii.control, 12);
    expect(AppRadii.card, 16);
    expect(AppRadii.control, isNot(AppRadii.card));
  });

  test('motion durations stay short and purposeful', () {
    expect(AppMotion.quick.inMilliseconds, inInclusiveRange(120, 180));
    expect(AppMotion.standard.inMilliseconds, inInclusiveRange(120, 180));
  });
}
