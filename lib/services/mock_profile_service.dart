import '../models/user_profile.dart';

abstract interface class ProfileService {
  Future<UserProfile> getProfile();

  Future<UserProfile> updateProfile(UserProfile profile);
}

class MockProfileService implements ProfileService {
  MockProfileService._();

  static final MockProfileService instance = MockProfileService._();

  UserProfile _profile = const UserProfile();

  @override
  Future<UserProfile> getProfile() async {
    await Future<void>.delayed(const Duration(milliseconds: 180));
    return _profile;
  }

  @override
  Future<UserProfile> updateProfile(UserProfile profile) async {
    await Future<void>.delayed(const Duration(milliseconds: 220));
    _profile = profile;
    return _profile;
  }
}
