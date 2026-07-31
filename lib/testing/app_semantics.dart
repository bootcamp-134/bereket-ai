abstract final class AppSemantics {
  // Welcome
  static const String welcomeLogin = 'welcome-login';
  static const String welcomeRegister = 'welcome-register';

  // Authentication
  static const String loginIdentifier = 'auth-login-identifier';
  static const String loginPassword = 'auth-login-password';
  static const String loginSubmit = 'auth-login-submit';
  static const String forgotPassword = 'auth-forgot-password';
  static const String registerSubmit = 'auth-register-submit';

  // Profile
  static const String profilePersonal = 'profile-personal';
  static const String profileHousehold = 'profile-household';
  static const String profilePreferences = 'profile-preferences';
  static const String profileContinue = 'profile-continue';
  static const String profilePersonalName = 'profile-personal-name';
  static const String profilePersonalAge = 'profile-personal-age';
  static const String profileHouseholdSize = 'profile-household-size';
  static const String profileMealsPerDay = 'profile-meals-per-day';
  static const String profileIncomeStatus = 'profile-income-status';
  static const String profileWeeklyBudget = 'profile-weekly-budget';
  static const String profileDietaryPreference = 'profile-dietary-preference';
  static const String profileAllergies = 'profile-allergies';
  static const String profileSectionSave = 'profile-section-save';

  // Recommendation input
  static const String ingredientInput = 'recommendation-ingredient-input';
  static const String ingredientAdd = 'recommendation-ingredient-add';
  static const String shoppingDisabled = 'recommendation-shopping-disabled';
  static const String shoppingEnabled = 'recommendation-shopping-enabled';
  static const String shoppingBudget = 'recommendation-shopping-budget';
  static const String findRecipes = 'recommendation-find-recipes';

  // Results and recipe
  static const String recommendationList = 'recommendation-list';
  static const String recipeAssistantOpen = 'recipe-assistant-open';

  // Recipe assistant
  static const String assistantInput = 'recipe-assistant-input';
  static const String assistantSend = 'recipe-assistant-send';

  const AppSemantics._();
}
