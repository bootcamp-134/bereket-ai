class RecipeIngredient {
  final String name;
  final String amount;
  final int estimatedCost;

  const RecipeIngredient({
    required this.name,
    required this.amount,
    required this.estimatedCost,
  });

  factory RecipeIngredient.fromJson(Map<String, dynamic> json) {
    final amountText = json['amountText']?.toString();
    final amount = json['amount'];
    final unit = json['unit']?.toString();
    final displayAmount =
        amountText ??
        [
          amount?.toString(),
          unit,
        ].where((part) => part != null && part.isNotEmpty).join(' ');
    return RecipeIngredient(
      name: json['name']?.toString() ?? '',
      amount: displayAmount,
      estimatedCost: (json['estimatedCostTry'] as num?)?.round() ?? 0,
    );
  }
}

class Recipe {
  final String id;
  final String title;
  final String description;
  final int preparationMinutes;
  final String difficulty;
  final List<RecipeIngredient> ingredients;
  final List<String> steps;

  const Recipe({
    required this.id,
    required this.title,
    required this.description,
    required this.preparationMinutes,
    required this.difficulty,
    required this.ingredients,
    required this.steps,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) => Recipe(
    id: json['id']?.toString() ?? '',
    title: json['title']?.toString() ?? 'İsimsiz tarif',
    description: json['description']?.toString() ?? '',
    preparationMinutes: (json['preparationMinutes'] as num?)?.round() ?? 0,
    difficulty: json['difficulty']?.toString() ?? 'Belirtilmemiş',
    ingredients: ((json['ingredients'] as List?) ?? const [])
        .whereType<Map>()
        .map((item) => RecipeIngredient.fromJson(item.cast<String, dynamic>()))
        .toList(growable: false),
    steps: ((json['steps'] as List?) ?? const [])
        .map(
          (step) =>
              step is Map ? step['text']?.toString() ?? '' : step.toString(),
        )
        .where((step) => step.isNotEmpty)
        .toList(growable: false),
  );
}
