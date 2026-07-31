import 'package:bereket_ai_mobile/models/user_profile.dart';
import 'package:bereket_ai_mobile/services/mock_profile_service.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('profile becomes complete after all required sections are supplied', () {
    const profile = UserProfile(
      fullName: 'Test Kullanıcısı',
      age: 28,
      householdSize: 3,
      mealsPerDay: 2,
      incomeStatus: 'Orta',
      weeklyFoodBudget: 2500,
      dietaryPreference: 'Standart',
    );

    expect(profile.isComplete, isTrue);
  });

  test('centralized updateProfile stores the whole profile', () async {
    final service = MockProfileService.instance;
    const updated = UserProfile(
      fullName: 'Test Kullanıcısı',
      age: 28,
      householdSize: 3,
      mealsPerDay: 2,
      incomeStatus: 'Orta',
      weeklyFoodBudget: 2500,
      dietaryPreference: 'Standart',
      allergies: 'Fındık',
    );

    await service.updateProfile(updated);
    final result = await service.getProfile();

    expect(result.fullName, 'Test Kullanıcısı');
    expect(result.householdSize, 3);
    expect(result.allergies, 'Fındık');
  });
}
