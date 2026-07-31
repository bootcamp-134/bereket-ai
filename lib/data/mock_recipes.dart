import '../models/recipe.dart';

abstract final class MockRecipes {
  static const List<Recipe> all = [
    Recipe(
      id: 'chicken-potato',
      title: 'Tavuklu Patates Yemeği',
      description:
          'Tek tencerede hazırlanan, doyurucu ve ev usulü tavuklu patates.',
      preparationMinutes: 45,
      difficulty: 'Kolay',
      ingredients: [
        RecipeIngredient(name: 'Tavuk', amount: '400 g', estimatedCost: 118),
        RecipeIngredient(name: 'Patates', amount: '3 adet', estimatedCost: 27),
        RecipeIngredient(name: 'Soğan', amount: '1 adet', estimatedCost: 11),
        RecipeIngredient(
          name: 'Salça',
          amount: '1 yemek kaşığı',
          estimatedCost: 14,
        ),
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '2 yemek kaşığı',
          estimatedCost: 16,
        ),
      ],
      steps: [
        'Tavuğu kuşbaşı, patatesi ve soğanı küp şeklinde doğra.',
        'Soğanı zeytinyağında yumuşayana kadar kavur.',
        'Tavukları ekleyip renk alana kadar pişir.',
        'Salça ve patatesleri ekleyip karıştır.',
        'Üzerini geçecek kadar sıcak su ekleyip 25 dakika pişir.',
      ],
    ),
    Recipe(
      id: 'tomato-pasta',
      title: 'Domatesli Makarna',
      description:
          'Az malzemeyle kısa sürede hazırlanan klasik domatesli makarna.',
      preparationMinutes: 25,
      difficulty: 'Çok kolay',
      ingredients: [
        RecipeIngredient(name: 'Makarna', amount: '1 paket', estimatedCost: 37),
        RecipeIngredient(name: 'Domates', amount: '3 adet', estimatedCost: 23),
        RecipeIngredient(name: 'Soğan', amount: '1 adet', estimatedCost: 11),
        RecipeIngredient(name: 'Sarımsak', amount: '1 diş', estimatedCost: 7),
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '2 yemek kaşığı',
          estimatedCost: 16,
        ),
      ],
      steps: [
        'Makarnayı paket üzerindeki süreye göre haşla.',
        'Soğan ve sarımsağı zeytinyağında kavur.',
        'Rendelenmiş domatesleri ekleyip 10 dakika pişir.',
        'Süzülen makarnayı sosa ekleyip iyice karıştır.',
      ],
    ),
    Recipe(
      id: 'lentil-soup',
      title: 'Kırmızı Mercimekli Sebze Çorbası',
      description:
          'Besleyici kırmızı mercimek, sebzeler ve salçayla hazırlanan sıcak çorba.',
      preparationMinutes: 35,
      difficulty: 'Kolay',
      ingredients: [
        RecipeIngredient(
          name: 'Kırmızı mercimek',
          amount: '1 su bardağı',
          estimatedCost: 43,
        ),
        RecipeIngredient(name: 'Soğan', amount: '1 adet', estimatedCost: 11),
        RecipeIngredient(name: 'Havuç', amount: '1 adet', estimatedCost: 17),
        RecipeIngredient(
          name: 'Salça',
          amount: '1 yemek kaşığı',
          estimatedCost: 14,
        ),
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '2 yemek kaşığı',
          estimatedCost: 16,
        ),
      ],
      steps: [
        'Mercimeği su berraklaşana kadar yıka.',
        'Doğranmış soğan ve havucu zeytinyağında kavur.',
        'Salça, mercimek ve sıcak suyu tencereye ekle.',
        'Sebzeler yumuşayana kadar yaklaşık 25 dakika pişir.',
        'Pürüzsüz bir kıvam için blenderdan geçir.',
      ],
    ),
    Recipe(
      id: 'yogurt-potato',
      title: 'Yoğurtlu Patates',
      description:
          'Haşlanmış patatesi sarımsaklı yoğurtla buluşturan ekonomik bir öğün.',
      preparationMinutes: 30,
      difficulty: 'Çok kolay',
      ingredients: [
        RecipeIngredient(name: 'Patates', amount: '4 adet', estimatedCost: 34),
        RecipeIngredient(name: 'Yoğurt', amount: '1 kase', estimatedCost: 29),
        RecipeIngredient(name: 'Sarımsak', amount: '1 diş', estimatedCost: 7),
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '1 yemek kaşığı',
          estimatedCost: 9,
        ),
      ],
      steps: [
        'Patatesleri yumuşayana kadar haşla ve küp küp doğra.',
        'Yoğurdu ezilmiş sarımsakla karıştır.',
        'Patatesleri servis tabağına alıp yoğurdu üzerine dök.',
        'Zeytinyağı gezdirerek servis et.',
      ],
    ),
    Recipe(
      id: 'vegetable-bulgur',
      title: 'Zeytinyağlı Sebzeli Bulgur Pilavı',
      description:
          'Bulgur ve mevsim sebzeleriyle hazırlanan bütçe dostu ana yemek.',
      preparationMinutes: 35,
      difficulty: 'Kolay',
      ingredients: [
        RecipeIngredient(
          name: 'Bulgur',
          amount: '1,5 su bardağı',
          estimatedCost: 33,
        ),
        RecipeIngredient(name: 'Domates', amount: '2 adet', estimatedCost: 19),
        RecipeIngredient(name: 'Biber', amount: '2 adet', estimatedCost: 21),
        RecipeIngredient(name: 'Soğan', amount: '1 adet', estimatedCost: 11),
        RecipeIngredient(
          name: 'Salça',
          amount: '1 yemek kaşığı',
          estimatedCost: 14,
        ),
        RecipeIngredient(
          name: 'Zeytinyağı',
          amount: '2 yemek kaşığı',
          estimatedCost: 16,
        ),
      ],
      steps: [
        'Soğan ve biberleri küçük küçük doğra.',
        'Sebzeleri zeytinyağında yumuşayana kadar kavur.',
        'Domates, salça ve yıkanmış bulguru ekleyip karıştır.',
        'Sıcak suyu ekleyip kısık ateşte suyunu çekene kadar pişir.',
        'Ocağı kapatıp 10 dakika dinlendir.',
      ],
    ),
  ];
}
