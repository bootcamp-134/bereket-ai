type ProfileCompletenessInput = {
  fullName: string | null;
  age: number | null;
  householdSize: number | null;
  mealsPerDay: number | null;
  incomeLevel: unknown;
  weeklyFoodBudget: unknown;
  dietPreferences: string[];
};

export function profileComplete(profile: ProfileCompletenessInput | null) {
  return Boolean(
    profile?.fullName?.trim() &&
    profile.age !== null &&
    profile.householdSize !== null &&
    profile.mealsPerDay !== null &&
    profile.incomeLevel &&
    profile.weeklyFoodBudget !== null &&
    profile.dietPreferences.length,
  );
}
