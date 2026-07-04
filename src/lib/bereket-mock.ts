export type IngredientRisk = "dusuk" | "orta" | "yuksek";

export type SuggestedIngredient = {
  id: string;
  name: string;
  category: string;
  risk: IngredientRisk;
  note: string;
};

export type PlanInput = {
  people: number;
  budget: number;
  days: number;
  selectedIngredients: string[];
  customIngredients: string[];
  prioritizeExpiring: boolean;
  priorityMode: string;
};

export type MealDay = {
  day: number;
  title: string;
  uses: string[];
  note: string;
};

export type ShoppingItem = {
  name: string;
  price: number;
  reason: string;
};

export type ScoreMetric = {
  key: "budget" | "waste" | "pantry";
  label: string;
  value: number;
  description: string;
};

export type PlanResult = {
  days: MealDay[];
  usedIngredients: string[];
  shoppingList: ShoppingItem[];
  totalCost: number;
  budgetRemaining: number;
  budgetUsagePercent: number;
  pantryCoverage: number;
  explanation: string;
  scores: ScoreMetric[];
  generatedAtLabel: string;
};

export const suggestedIngredients: SuggestedIngredient[] = [
  {
    id: "patates",
    name: "Patates",
    category: "Sebze",
    risk: "orta",
    note: "Tok tutan temel malzeme",
  },
  {
    id: "sogan",
    name: "Soğan",
    category: "Sebze",
    risk: "dusuk",
    note: "Çoğu yemeğe taban olur",
  },
  {
    id: "tavuk",
    name: "Tavuk",
    category: "Protein",
    risk: "yuksek",
    note: "İlk günlerde kullanılır",
  },
  {
    id: "yogurt",
    name: "Yoğurt",
    category: "Süt ürünü",
    risk: "yuksek",
    note: "Bozulma riski yüksek",
  },
  {
    id: "makarna",
    name: "Makarna",
    category: "Kiler",
    risk: "dusuk",
    note: "Ekonomik ana öğün",
  },
  {
    id: "domates",
    name: "Domates",
    category: "Sebze",
    risk: "orta",
    note: "Sos ve yemek tabanı",
  },
  {
    id: "pirinc",
    name: "Pirinç",
    category: "Kiler",
    risk: "dusuk",
    note: "Alternatif karbonhidrat",
  },
  {
    id: "yumurta",
    name: "Yumurta",
    category: "Protein",
    risk: "orta",
    note: "Hızlı tamamlayıcı",
  },
];

export const planDurationItems = [
  { label: "5 gün", value: "5" },
  { label: "4 gün", value: "4" },
  { label: "3 gün", value: "3" },
];

export const priorityModeItems = [
  { label: "İsraf öncelikli", value: "waste" },
  { label: "Bütçe öncelikli", value: "budget" },
  { label: "Dengeli", value: "balanced" },
];

const basePlan: MealDay[] = [
  {
    day: 1,
    title: "Tavuklu Makarna",
    uses: ["Tavuk", "Makarna", "Soğan"],
    note: "Tavuk ilk güne alınarak bozulma riski azaltılır.",
  },
  {
    day: 2,
    title: "Yoğurtlu Patates",
    uses: ["Yoğurt", "Patates"],
    note: "Yoğurt erken kullanılır, patatesle düşük maliyetli bir öğün çıkar.",
  },
  {
    day: 3,
    title: "Domatesli Makarna",
    uses: ["Domates", "Makarna", "Soğan"],
    note: "Kiler ürünü makarna domatesle tamamlanır.",
  },
  {
    day: 4,
    title: "Tavuklu Patates Yemeği",
    uses: ["Tavuk", "Patates", "Soğan"],
    note: "Kalan tavuk ve patates ana yemek olarak değerlendirilir.",
  },
  {
    day: 5,
    title: "Sebzeli Makarna",
    uses: ["Makarna", "Domates"],
    note: "Son gün kiler kullanımı artırılır ve alışveriş ihtiyacı düşük tutulur.",
  },
];

const shoppingList: ShoppingItem[] = [
  {
    name: "Krema",
    price: 45,
    reason: "Tavuklu makarna sosunu tamamlamak için",
  },
  {
    name: "Maydanoz",
    price: 15,
    reason: "Yoğurtlu patatesi tazelemek için",
  },
  {
    name: "Salça",
    price: 55,
    reason: "Domatesli ve patatesli yemeklere taban için",
  },
  {
    name: "Biber",
    price: 40,
    reason: "Sebzeli makarna ve tencere yemeği için",
  },
];

export const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  currency: "TRY",
  maximumFractionDigits: 0,
  style: "currency",
});

export const percentFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
  style: "percent",
});

export function parseIngredients(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createMockPlan(input: PlanInput): PlanResult {
  const normalizedCustomIngredients = input.customIngredients.map(
    (ingredient) => ingredient.trim(),
  );
  const usedIngredients = Array.from(
    new Set([...input.selectedIngredients, ...normalizedCustomIngredients]),
  ).filter(Boolean);

  const totalCost = shoppingList.reduce((sum, item) => sum + item.price, 0);
  const budgetRemaining = Math.max(input.budget - totalCost, 0);
  const budgetUsagePercent =
    input.budget > 0
      ? Math.min(Math.round((totalCost / input.budget) * 100), 100)
      : 0;
  const pantryCoverage = Math.min(
    Math.round((usedIngredients.length / 8) * 100),
    96,
  );

  return {
    budgetRemaining,
    budgetUsagePercent,
    days: basePlan.slice(0, input.days),
    explanation: input.prioritizeExpiring
      ? "Bu plan, tavuk ve yoğurt gibi daha kısa sürede bozulabilecek ürünleri ilk günlerde kullanacak şekilde oluşturulmuştur. Mevcut malzemelerden yararlanıldığı için alışveriş maliyeti düşük tutulmuştur."
      : "Bu plan, evdeki temel malzemeleri önceleyen düşük maliyetli bir örnek akış olarak oluşturulmuştur. Bozulma riski notları görünür tutulur; Sprint 1’de sonuçlar mock veriyle üretilir.",
    generatedAtLabel: "Sprint 1 mock demo",
    pantryCoverage,
    scores: [
      {
        description: `${currencyFormatter.format(input.budget)} bütçede ${currencyFormatter.format(totalCost)} ek alışveriş`,
        key: "budget",
        label: "Bütçe Uyumu",
        value: input.budget >= totalCost ? 83 : 48,
      },
      {
        description: input.prioritizeExpiring
          ? "Tavuk ve yoğurt ilk iki güne alındı"
          : "Bozulma riski görünür tutuldu",
        key: "waste",
        label: "İsraf Azaltma",
        value: input.prioritizeExpiring ? 92 : 74,
      },
      {
        description: `${usedIngredients.length} mevcut malzeme plan içinde değerlendirildi`,
        key: "pantry",
        label: "Kiler Kullanımı",
        value: Math.max(pantryCoverage, 78),
      },
    ],
    shoppingList,
    totalCost,
    usedIngredients,
  };
}
