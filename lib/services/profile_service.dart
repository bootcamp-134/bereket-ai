import '../models/user_profile.dart';

abstract interface class ProfileService {
  Future<UserProfile> getProfile();
  Future<UserProfile> updateProfile(UserProfile profile);
}
