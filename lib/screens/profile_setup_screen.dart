import 'package:flutter/material.dart';

import '../models/user_profile.dart';
import '../services/mock_profile_service.dart';
import '../theme/app_theme.dart';
import '../widgets/brand_mark.dart';
import '../widgets/primary_button.dart';
import 'profile_section_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final ProfileService _profileService = MockProfileService.instance;

  UserProfile _profile = const UserProfile();
  bool _loading = true;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _profileService.getProfile();
      if (!mounted) return;
      setState(() {
        _profile = profile;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
      _showMessage('Profil bilgileri şu anda görüntülenemiyor.');
    }
  }

  Future<void> _editSection(ProfileSection section) async {
    if (_saving) return;

    final updated = await Navigator.of(context).push<UserProfile>(
      MaterialPageRoute(
        builder: (_) =>
            ProfileSectionScreen(section: section, profile: _profile),
      ),
    );

    if (updated == null || !mounted) return;

    setState(() => _saving = true);
    try {
      final saved = await _profileService.updateProfile(updated);
      if (!mounted) return;
      setState(() => _profile = saved);
      _showMessage('Bilgilerin güncellendi.');
    } catch (_) {
      if (!mounted) return;
      _showMessage('Değişiklikler kaydedilemedi. Tekrar deneyebilirsin.');
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  void _continueToRecipes() {
    if (!_profile.isComplete) {
      _showMessage('Devam etmek için üç bölümü de tamamla.');
      return;
    }
    Navigator.of(context).pushReplacementNamed('/what-should-i-eat');
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Çıkış'),
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SafeArea(
        top: false,
        child: _loading
            ? const _ProfileLoading()
            : SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 520),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Align(child: BrandMark(size: 72)),
                        const SizedBox(height: 26),
                        Text(
                          'Tariflerini evine göre ayarla',
                          textAlign: TextAlign.center,
                          style: theme.textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Kişi sayını, haftalık bütçeni ve beslenme tercihlerini tarif önerilerinde kullanalım.',
                          textAlign: TextAlign.center,
                          style: theme.textTheme.bodyLarge,
                        ),
                        const SizedBox(height: 30),
                        _SetupStep(
                          number: '1',
                          icon: Icons.person_outline_rounded,
                          title: 'Kişisel bilgiler',
                          description: _profile.hasPersonalInformation
                              ? '${_profile.fullName}, ${_profile.age} yaş'
                              : 'Ad, yaş ve temel bilgiler',
                          isComplete: _profile.hasPersonalInformation,
                          onTap: () => _editSection(ProfileSection.personal),
                        ),
                        const SizedBox(height: 12),
                        _SetupStep(
                          number: '2',
                          icon: Icons.groups_outlined,
                          title: 'Hane bilgileri',
                          description: _profile.hasHouseholdInformation
                              ? '${_profile.householdSize} kişi • Günde ${_profile.mealsPerDay} öğün'
                              : 'Kişi sayısı ve öğün düzeni',
                          isComplete: _profile.hasHouseholdInformation,
                          onTap: () => _editSection(ProfileSection.household),
                        ),
                        const SizedBox(height: 12),
                        _SetupStep(
                          number: '3',
                          icon: Icons.tune_rounded,
                          title: 'Bütçe ve tercihler',
                          description: _profile.hasBudgetAndPreferences
                              ? '₺${_profile.weeklyFoodBudget}/hafta • ${_profile.dietaryPreference}'
                              : 'Bütçe, alerjiler ve beslenme şekli',
                          isComplete: _profile.hasBudgetAndPreferences,
                          onTap: () => _editSection(ProfileSection.preferences),
                        ),
                        if (_saving) ...[
                          const SizedBox(height: 18),
                          const LinearProgressIndicator(),
                        ],
                        const SizedBox(height: 32),
                        PrimaryButton(
                          key: const Key('open-what-should-i-eat-button'),
                          label: _profile.isComplete
                              ? 'Tariflerini Keşfet'
                              : 'Profilini Tamamla',
                          icon: Icons.arrow_forward_rounded,
                          onPressed: _saving ? null : _continueToRecipes,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
      ),
    );
  }
}

class _SetupStep extends StatelessWidget {
  final String number;
  final IconData icon;
  final String title;
  final String description;
  final bool isComplete;
  final VoidCallback onTap;

  const _SetupStep({
    required this.number,
    required this.icon,
    required this.title,
    required this.description,
    required this.isComplete,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isComplete ? AppColors.sage : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadii.card),
        side: BorderSide(
          color: isComplete ? AppColors.leaf : AppColors.outline,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.card),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: isComplete ? AppColors.forest : AppColors.cream,
                  shape: BoxShape.circle,
                ),
                child: isComplete
                    ? const Icon(
                        Icons.check_rounded,
                        color: Colors.white,
                        size: 22,
                      )
                    : Text(
                        number,
                        style: const TextStyle(
                          color: AppColors.forest,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
              ),
              const SizedBox(width: 14),
              Icon(icon, color: AppColors.forest, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: AppColors.ink,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.mutedInk,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right_rounded, color: AppColors.forest),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfileLoading extends StatelessWidget {
  const _ProfileLoading();

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Profil bilgileri yükleniyor',
      child: ExcludeSemantics(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Column(
                children: [
                  const BrandMark(size: 72),
                  const SizedBox(height: 26),
                  const _SkeletonBlock(width: 250, height: 28),
                  const SizedBox(height: 12),
                  const _SkeletonBlock(width: 310, height: 16),
                  const SizedBox(height: 30),
                  for (var index = 0; index < 3; index++) ...[
                    const _SkeletonBlock(height: 76),
                    if (index < 2) const SizedBox(height: 12),
                  ],
                  const SizedBox(height: 32),
                  const _SkeletonBlock(height: 58),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SkeletonBlock extends StatelessWidget {
  final double? width;
  final double height;

  const _SkeletonBlock({this.width, required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.outline.withValues(alpha: 0.55),
        borderRadius: BorderRadius.circular(AppRadii.control),
      ),
    );
  }
}
