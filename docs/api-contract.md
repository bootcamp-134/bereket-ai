# Bereket AI V1 API sözleşmesi

Base URL: `https://api.bereket.app/api/v1`

Swagger: `https://api.bereket.app/api/docs`

## Envelope

Başarılı yanıt:

```json
{
  "data": {},
  "meta": { "requestId": "req_..." }
}
```

Hata:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Gönderilen alanlardan biri geçersiz.",
    "details": [{ "reason": "..." }],
    "requestId": "req_..."
  }
}
```

Health ve auth dışındaki tüm endpointlerde `Authorization: Bearer <accessToken>` zorunludur.

## Auth

- `POST /auth/register` — `email`, 12–128 karakter `password`, opsiyonel `fullName`.
- `POST /auth/login` — access ve refresh token döndürür.
- `POST /auth/refresh` — opaque refresh tokenı rotate eder. Flutter eski tokenı başarıyla yenilendiği anda kalıcı depodan silmelidir.
- `POST /auth/logout` — access token içindeki session’ı revoke eder; `204`.
- `POST /auth/forgot-password` — kullanıcı varlığını açıklamadan her zaman `202`.
- `POST /auth/reset-password` — `token` ve yeni parola; başarılıysa `204`.

Access token 15 dakika, refresh token 30 gündür. Aynı anda gelen refresh isteklerini Flutter tarafında tek bir mutex/future altında birleştirmek zorunludur. Rotation sonrası eski tokenın yeniden kullanılması tüm token ailesini revoke eder.

## Profil

- `GET /me`
- `PATCH /me/profile`

Patch alanları: `fullName`, `age`, `householdSize`, `mealsPerDay`, `incomeLevel`, `weeklyFoodBudget`, `dietPreferences`, `allergens`.

`null` kabul edilmez. Dizi temizlemek için `[]` gönderilir. Gönderilmeyen alan değişmez.

Flutter enum değerleri:

```text
incomeLevel: unspecified | low | middle | high
```

## Tarifler

- `GET /recipes?search=&category=&difficulty=&excludeAllergens=&page=1&pageSize=20`
- `GET /recipes/:id`

Süre, porsiyon ve maliyet alanları dataset eksikse `null` olabilir. `estimatedCost.isPartial=true` ise tutar yalnız fiyatlandırılabilen malzemelerin toplamıdır. `allergenDataStatus` şu an `inferred` değerindedir.

## Öneriler

`POST /recommendations/recipes`

```json
{
  "availableIngredients": ["tavuk", "patates"],
  "wantsToShop": true,
  "budgetTry": 250
}
```

- En fazla 20 malzeme.
- `wantsToShop=true` ise `budgetTry` zorunlu.
- `wantsToShop=false` ise yalnız eksiksiz tarifler döner.
- Kullanıcının profil alerjenleri hard-filter’dır.
- Sonuç yoksa HTTP başarıdır: `results: []` ve `noResultsReason` döner.
- `generatedBy` değeri `openai` veya `deterministic`; `fallback` modele ulaşılamadığını belirtir.

## Tarif sohbeti

- `POST /recipe-chat/sessions` — body `{ "recipeId": "rec_..." }`.
- `GET /recipe-chat/sessions/:sessionId/messages`
- `POST /recipe-chat/sessions/:sessionId/messages` — body `{ "message": "..." }`.

Oturum başka kullanıcıya aitse bilgi sızdırmadan `404` döner. Agent yalnız seçili tarif ve son 10 mesajı kullanır; web/tool erişimi yoktur. Fallback yanıtlarında `assistantMessage.fallback=true` olur.

## Agent çalışma sınırları

- Deterministic katman önce alerjen ve bütçe hard-filter’larını uygular, OpenAI en fazla 15 güvenli adayı yeniden sıralar.
- Modelin döndürdüğü her `recipeId` aday listesine karşı tekrar doğrulanır; geçersiz veya boş çıktı fallback üretir.
- Kullanıcıya ait ham kimlik OpenAI’ye gönderilmez; HMAC tabanlı tek yönlü safety identifier kullanılır.
- Aylık maliyet limiti her çağrıdan önce PostgreSQL üzerinde atomik rezervasyonla korunur. Model hatasında rezervasyon iade edilir.

## Flutter entegrasyon notları — Anıl

- Base URL ve modelleri bu sözleşmeden üret; eski mock `/api` ve `PUT /me/onboarding` çağrılarını kaldır.
- Access/refresh tokenları platform secure storage’da tut.
- 401’de tek refresh mutex kullan; başarılı rotation sonrası isteği bir kez tekrar et.
- Refresh de 401 dönerse local oturumu temizle ve login’e yönlendir.
- Nullable süre/porsiyon/maliyet alanlarını zorunlu Dart tipi yapma.
- UI’da `isPartial`, `allergenDataStatus`, `fallback` ve `noResultsReason` durumlarını görünür ele al.
- Staging Maestro akışları: register → profile → recommendations → detail → chat → refresh → logout.
