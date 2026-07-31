class UserProfile {
  final String fullName;
  final int? age;
  final int? householdSize;
  final int? mealsPerDay;
  final String incomeStatus;
  final int? weeklyFoodBudget;
  final String dietaryPreference;
  final String allergies;

  const UserProfile({
    this.fullName = '',
    this.age,
    this.householdSize,
    this.mealsPerDay,
    this.incomeStatus = '',
    this.weeklyFoodBudget,
    this.dietaryPreference = '',
    this.allergies = '',
  });

  bool get hasPersonalInformation => fullName.trim().isNotEmpty && age != null;

  bool get hasHouseholdInformation =>
      householdSize != null && mealsPerDay != null;

  bool get hasBudgetAndPreferences =>
      incomeStatus.isNotEmpty &&
      weeklyFoodBudget != null &&
      dietaryPreference.isNotEmpty;

  bool get isComplete =>
      hasPersonalInformation &&
      hasHouseholdInformation &&
      hasBudgetAndPreferences;

  UserProfile copyWith({
    String? fullName,
    int? age,
    int? householdSize,
    int? mealsPerDay,
    String? incomeStatus,
    int? weeklyFoodBudget,
    String? dietaryPreference,
    String? allergies,
  }) {
    return UserProfile(
      fullName: fullName ?? this.fullName,
      age: age ?? this.age,
      householdSize: householdSize ?? this.householdSize,
      mealsPerDay: mealsPerDay ?? this.mealsPerDay,
      incomeStatus: incomeStatus ?? this.incomeStatus,
      weeklyFoodBudget: weeklyFoodBudget ?? this.weeklyFoodBudget,
      dietaryPreference: dietaryPreference ?? this.dietaryPreference,
      allergies: allergies ?? this.allergies,
    );
  }
}
