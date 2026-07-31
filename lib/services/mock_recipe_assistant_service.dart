import '../models/recipe.dart';

class MockRecipeAssistantService {
  static const int maxQuestionLength = 300;

  const MockRecipeAssistantService();

  String cleanQuestion(String value) {
    return value
        .replaceAll(RegExp(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]'), '')
        .trim();
  }

  Future<String> getReply({
    required Recipe recipe,
    required String question,
  }) async {
    final safeQuestion = cleanQuestion(question);

    if (safeQuestion.isEmpty) {
      return 'Tarifle ilgili sorunuzu biraz daha ayrıntılı yazabilirsiniz.';
    }

    if (safeQuestion.length > maxQuestionLength) {
      return 'Sorunuz çok uzun. Lütfen daha kısa bir şekilde tekrar yazın.';
    }

    await Future<void>.delayed(const Duration(milliseconds: 650));

    final normalizedQuestion = safeQuestion.toLowerCase();

    if (_containsAny(normalizedQuestion, [
      'sonraki',
      'adım',
      'nereden başlamalı',
      'nasıl başlamalı',
    ])) {
      if (recipe.steps.isEmpty) {
        return 'Bu tarif için henüz hazırlanış adımı bulunmuyor.';
      }

      return 'İlk olarak şu adımla başlayabilirsin:\n\n'
          '${recipe.steps.first}';
    }

    if (_containsAny(normalizedQuestion, [
      'kaç dakika',
      'ne kadar sürer',
      'süre',
      'zaman',
    ])) {
      return '${recipe.title} yaklaşık '
          '${recipe.preparationMinutes} dakikada hazırlanabilir.';
    }

    if (_containsAny(normalizedQuestion, [
      'malzeme',
      'malzemeler',
      'nelere ihtiyacım',
    ])) {
      final ingredientNames = recipe.ingredients
          .map((ingredient) => ingredient.name)
          .join(', ');

      return 'Bu tarif için gereken malzemeler:\n\n$ingredientNames';
    }

    if (_containsAny(normalizedQuestion, [
      'yerine',
      'alternatif',
      'eksik',
      'yok',
    ])) {
      return 'Eksik malzemeyi benzer tat ve yapıya sahip bir ürünle '
          'değiştirebilirsin. Hangi malzemenin eksik olduğunu yazarsan '
          'daha uygun bir alternatif önerebilirim.';
    }

    if (_containsAny(normalizedQuestion, [
      'porsiyon',
      'kişi',
      'azalt',
      'çoğalt',
    ])) {
      return 'Porsiyon miktarını değiştirirken bütün malzemeleri aynı '
          'oranda artırıp azaltmalısın. Baharatları ise azar azar '
          'ekleyerek tadını kontrol etmen daha iyi olur.';
    }

    if (_containsAny(normalizedQuestion, [
      'pişti',
      'pişmiş',
      'hazır',
      'nasıl anlarım',
    ])) {
      return 'Yemeğin hazır olup olmadığını görünümünü, dokusunu ve '
          'tarifte belirtilen süreyi birlikte değerlendirerek kontrol et. '
          'Gıda güvenliği açısından çiğ kalan ürünleri tüketme.';
    }

    return '${recipe.title} hakkında malzemeleri, hazırlanış adımlarını, '
        'süreyi veya eksik bir malzemenin alternatifini sorabilirsin.';
  }

  bool _containsAny(String source, List<String> values) {
    return values.any(source.contains);
  }
}
