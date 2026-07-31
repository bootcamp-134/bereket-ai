import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/user_profile.dart';
import '../theme/app_theme.dart';
import '../widgets/primary_button.dart';

enum ProfileSection { personal, household, preferences }

class ProfileSectionScreen extends StatefulWidget {
  final ProfileSection section;
  final UserProfile profile;

  const ProfileSectionScreen({
    super.key,
    required this.section,
    required this.profile,
  });

  @override
  State<ProfileSectionScreen> createState() => _ProfileSectionScreenState();
}

class _ProfileSectionScreenState extends State<ProfileSectionScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _ageController;
  late final TextEditingController _householdController;
  late final TextEditingController _mealsController;
  late final TextEditingController _budgetController;
  late final TextEditingController _allergiesController;

  late String _incomeStatus;
  late String _dietaryPreference;
  bool _submitting = false;

  static const _incomeOptions = <String>[
    'Belirtmek istemiyorum',
    'Düşük',
    'Orta',
    'Yüksek',
  ];

  static const _dietOptions = <String>[
    'Standart',
    'Vejetaryen',
    'Vegan',
    'Glütensiz',
  ];

  @override
  void initState() {
    super.initState();
    final profile = widget.profile;
    _nameController = TextEditingController(text: profile.fullName);
    _ageController = TextEditingController(text: profile.age?.toString() ?? '');
    _householdController = TextEditingController(
      text: profile.householdSize?.toString() ?? '',
    );
    _mealsController = TextEditingController(
      text: profile.mealsPerDay?.toString() ?? '',
    );
    _budgetController = TextEditingController(
      text: profile.weeklyFoodBudget?.toString() ?? '',
    );
    _allergiesController = TextEditingController(text: profile.allergies);
    _incomeStatus = profile.incomeStatus.isEmpty
        ? _incomeOptions.first
        : profile.incomeStatus;
    _dietaryPreference = profile.dietaryPreference.isEmpty
        ? _dietOptions.first
        : profile.dietaryPreference;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _householdController.dispose();
    _mealsController.dispose();
    _budgetController.dispose();
    _allergiesController.dispose();
    super.dispose();
  }

  String get _title {
    return switch (widget.section) {
      ProfileSection.personal => 'Kişisel bilgiler',
      ProfileSection.household => 'Hane bilgileri',
      ProfileSection.preferences => 'Bütçe ve tercihler',
    };
  }

  String get _description {
    return switch (widget.section) {
      ProfileSection.personal =>
        'Sana uygun öneriler sunabilmemiz için temel bilgilerini gir.',
      ProfileSection.household =>
        'Tariflerin porsiyonlarını evindeki kişi ve öğün düzenine göre ayarlayalım.',
      ProfileSection.preferences =>
        'Önerileri bütçene ve beslenme tercihlerine göre kişiselleştirelim.',
    };
  }

  String? _requiredText(String? value, {required int maxLength}) {
    final normalized = value?.trim() ?? '';
    if (normalized.isEmpty) {
      return 'Bu alan zorunludur.';
    }
    if (normalized.length > maxLength) {
      return 'En fazla $maxLength karakter girebilirsin.';
    }
    if (RegExp(r'[\u0000-\u001F\u007F]').hasMatch(normalized)) {
      return 'Geçersiz karakter içeriyor.';
    }
    return null;
  }

  String? _numberInRange(
    String? value, {
    required int minimum,
    required int maximum,
  }) {
    final number = int.tryParse(value?.trim() ?? '');
    if (number == null) {
      return 'Geçerli bir sayı gir.';
    }
    if (number < minimum || number > maximum) {
      return '$minimum ile $maximum arasında bir değer gir.';
    }
    return null;
  }

  Future<void> _save() async {
    if (_submitting || !(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    setState(() => _submitting = true);
    FocusScope.of(context).unfocus();

    final current = widget.profile;
    final updated = switch (widget.section) {
      ProfileSection.personal => current.copyWith(
        fullName: _nameController.text.trim(),
        age: int.parse(_ageController.text.trim()),
      ),
      ProfileSection.household => current.copyWith(
        householdSize: int.parse(_householdController.text.trim()),
        mealsPerDay: int.parse(_mealsController.text.trim()),
      ),
      ProfileSection.preferences => current.copyWith(
        incomeStatus: _incomeStatus,
        weeklyFoodBudget: int.parse(_budgetController.text.trim()),
        dietaryPreference: _dietaryPreference,
        allergies: _allergiesController.text.trim(),
      ),
    };

    if (!mounted) return;
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_title),
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
      ),
      body: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 30),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      alignment: Alignment.center,
                      decoration: const BoxDecoration(
                        color: AppColors.sage,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        switch (widget.section) {
                          ProfileSection.personal =>
                            Icons.person_outline_rounded,
                          ProfileSection.household => Icons.groups_outlined,
                          ProfileSection.preferences => Icons.tune_rounded,
                        },
                        color: AppColors.forest,
                        size: 30,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      _title,
                      textAlign: TextAlign.center,
                      style: theme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _description,
                      textAlign: TextAlign.center,
                      style: theme.textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 28),
                    ..._sectionFields(),
                    const SizedBox(height: 28),
                    PrimaryButton(
                      label: 'Kaydet',
                      icon: Icons.check_rounded,
                      isLoading: _submitting,
                      onPressed: _save,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _sectionFields() {
    return switch (widget.section) {
      ProfileSection.personal => [
        TextFormField(
          controller: _nameController,
          textInputAction: TextInputAction.next,
          maxLength: 60,
          validator: (value) => _requiredText(value, maxLength: 60),
          decoration: const InputDecoration(
            labelText: 'Ad ve soyad',
            hintText: 'Adını ve soyadını gir',
            prefixIcon: Icon(Icons.badge_outlined),
          ),
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _ageController,
          keyboardType: TextInputType.number,
          textInputAction: TextInputAction.done,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          validator: (value) =>
              _numberInRange(value, minimum: 13, maximum: 120),
          decoration: const InputDecoration(
            labelText: 'Yaş',
            hintText: 'Örn. 28',
            prefixIcon: Icon(Icons.cake_outlined),
          ),
        ),
      ],
      ProfileSection.household => [
        TextFormField(
          controller: _householdController,
          keyboardType: TextInputType.number,
          textInputAction: TextInputAction.next,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          validator: (value) => _numberInRange(value, minimum: 1, maximum: 20),
          decoration: const InputDecoration(
            labelText: 'Hanedeki kişi sayısı',
            hintText: 'Örn. 4',
            prefixIcon: Icon(Icons.groups_outlined),
          ),
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _mealsController,
          keyboardType: TextInputType.number,
          textInputAction: TextInputAction.done,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          validator: (value) => _numberInRange(value, minimum: 1, maximum: 6),
          decoration: const InputDecoration(
            labelText: 'Günlük ana öğün sayısı',
            hintText: 'Örn. 3',
            prefixIcon: Icon(Icons.restaurant_outlined),
          ),
        ),
      ],
      ProfileSection.preferences => [
        DropdownButtonFormField<String>(
          initialValue: _incomeStatus,
          decoration: const InputDecoration(
            labelText: 'Gelir durumu',
            prefixIcon: Icon(Icons.account_balance_wallet_outlined),
          ),
          items: _incomeOptions
              .map(
                (option) =>
                    DropdownMenuItem(value: option, child: Text(option)),
              )
              .toList(),
          onChanged: (value) {
            if (value != null) {
              setState(() => _incomeStatus = value);
            }
          },
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _budgetController,
          keyboardType: TextInputType.number,
          textInputAction: TextInputAction.next,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          validator: (value) =>
              _numberInRange(value, minimum: 1, maximum: 100000),
          decoration: const InputDecoration(
            labelText: 'Haftalık gıda bütçesi',
            hintText: 'Örn. 2500',
            prefixText: '₺ ',
            prefixIcon: Icon(Icons.payments_outlined),
          ),
        ),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(
          initialValue: _dietaryPreference,
          decoration: const InputDecoration(
            labelText: 'Beslenme şekli',
            prefixIcon: Icon(Icons.eco_outlined),
          ),
          items: _dietOptions
              .map(
                (option) =>
                    DropdownMenuItem(value: option, child: Text(option)),
              )
              .toList(),
          onChanged: (value) {
            if (value != null) {
              setState(() => _dietaryPreference = value);
            }
          },
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _allergiesController,
          minLines: 2,
          maxLines: 3,
          maxLength: 200,
          textInputAction: TextInputAction.done,
          validator: (value) {
            final normalized = value?.trim() ?? '';
            if (RegExp(r'[\u0000-\u001F\u007F]').hasMatch(normalized)) {
              return 'Geçersiz karakter içeriyor.';
            }
            return null;
          },
          decoration: const InputDecoration(
            labelText: 'Alerjiler',
            hintText: 'Yoksa boş bırakabilirsin',
            prefixIcon: Icon(Icons.health_and_safety_outlined),
            alignLabelWithHint: true,
          ),
        ),
      ],
    };
  }
}
