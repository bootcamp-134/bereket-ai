const turkishMap: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

export function normalizeTurkish(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (character) => turkishMap[character] ?? character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const allergenRules: Array<[string, RegExp]> = [
  [
    "gluten",
    /\b(bugday|arpa|cavdar|yulaf|un|bulgur|irmik|makarna|sehriye|ekmek|galeta)\b/,
  ],
  ["sut", /\b(sut|peynir|yogurt|tereyag|krema|kaymak|ayran|kefir)\b/],
  ["yumurta", /\b(yumurta|mayonez)\b/],
  ["balik", /\b(balik|somon|ton|hamsi|levrek|cipura|uskumru|sardalya)\b/],
  ["kabuklu-deniz", /\b(karides|yengec|istakoz)\b/],
  ["yer-fistigi", /\b(yer fistigi|fistik ezmesi)\b/],
  ["soya", /\b(soya|tofu|edamame)\b/],
  [
    "sert-kabuklu",
    /\b(badem|findik|ceviz|kaju|antep fistigi|pek(?:a|an)|makademya)\b/,
  ],
  ["kereviz", /\bkereviz\b/],
  ["hardal", /\bhardal\b/],
  ["susam", /\b(susam|tahin)\b/],
  ["sulfit", /\b(sulfit|sarap|sirke|kurutulmus meyve)\b/],
  ["aci-bakla", /\baci bakla\b/],
  ["yumusakca", /\b(midye|kalamar|ahtapot|istiridye|salyangoz)\b/],
];

export function inferAllergens(names: string[]) {
  const text = names.map(normalizeTurkish).join(" ");
  return allergenRules
    .filter(([, rule]) => rule.test(text))
    .map(([category]) => category);
}
