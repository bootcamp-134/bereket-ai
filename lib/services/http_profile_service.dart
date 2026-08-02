import '../models/user_profile.dart';
import '../network/api_client.dart';
import 'profile_service.dart';

class HttpProfileService implements ProfileService {
  final ApiClient _api;

  HttpProfileService(this._api);

  static const _incomeToApi = {
    'Belirtmek istemiyorum': 'unspecified',
    'Düşük': 'low',
    'Orta': 'middle',
    'Yüksek': 'high',
  };
  static const _incomeFromApi = {
    'unspecified': 'Belirtmek istemiyorum',
    'low': 'Düşük',
    'middle': 'Orta',
    'high': 'Yüksek',
  };
  static const _dietFromApi = {
    'standart': 'Standart',
    'vejetaryen': 'Vejetaryen',
    'vegan': 'Vegan',
    'glütensiz': 'Glütensiz',
  };

  @override
  Future<UserProfile> getProfile() async {
    final data = await _api.get('/me') as Map<String, dynamic>;
    final raw = data['profile'];
    if (raw is! Map) return const UserProfile();
    return _fromJson(raw.cast<String, dynamic>());
  }

  @override
  Future<UserProfile> updateProfile(UserProfile profile) async {
    final payload = <String, dynamic>{
      'fullName': profile.fullName,
      'age': profile.age,
      'householdSize': profile.householdSize,
      'mealsPerDay': profile.mealsPerDay,
      'incomeLevel': _incomeToApi[profile.incomeStatus] ?? 'unspecified',
      'weeklyFoodBudget': profile.weeklyFoodBudget,
      'dietPreferences': profile.dietaryPreference.isEmpty
          ? <String>[]
          : [profile.dietaryPreference],
      'allergens': profile.allergies
          .split(',')
          .map((item) => item.trim())
          .where((item) => item.isNotEmpty)
          .toList(growable: false),
    }..removeWhere((_, value) => value == null);
    final data =
        await _api.patch('/me/profile', data: payload) as Map<String, dynamic>;
    return _fromJson(data);
  }

  UserProfile _fromJson(Map<String, dynamic> json) {
    final diets =
        (json['dietPreferences'] as List?)?.map((e) => e.toString()).toList() ??
        const <String>[];
    final allergens =
        (json['allergens'] as List?)?.map((e) => e.toString()).toList() ??
        const <String>[];
    return UserProfile(
      fullName: json['fullName']?.toString() ?? '',
      age: (json['age'] as num?)?.round(),
      householdSize: (json['householdSize'] as num?)?.round(),
      mealsPerDay: (json['mealsPerDay'] as num?)?.round(),
      incomeStatus: _incomeFromApi[json['incomeLevel']] ?? '',
      weeklyFoodBudget: (json['weeklyFoodBudget'] as num?)?.round(),
      dietaryPreference: diets.isEmpty
          ? ''
          : (_dietFromApi[diets.first.toLowerCase()] ?? diets.first),
      allergies: allergens.join(', '),
    );
  }
}
