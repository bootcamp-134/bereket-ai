# Sprint 2 Teknik Planı

> Bu plan, mevcut Sprint 1 mock prototipini gerçek bir Gemini AI agent zinciriyle değiştirmek için hazırlandı. 7 ajanlı bir analiz (kod audit + 4 paralel bileşen tasarımı + sentez + adversarial doğrulama) sonucu üretildi; doğrulama aşamasındaki kritik düzeltmeler plana entegre edildi.

## Sprint Hedefi

Sprint 1'in sabit mock çıktısını (`createMockPlan` + modül-seviye `fixedPlan` + `getRandomAssistantAnswer`) gerçek bir Gemini agent zinciriyle değiştirmek:

- **Parser agent** (`extract_plan_input`, function-calling): serbest Türkçe metni `PlanInput`'a çevirir.
- **Planner agent** (`generate_plan`, structured output): `PlanInput`'u şema-kilitli `PlanResult`'a çevirir.

UI (`bereket-prototype.tsx`) mümkün olduğunca **sabit** kalır. Final değerlendirmenin en büyük kalemi "Yapay zeka öğeleri" (35 puan) bu sprintin odağıdır.

## Mimari Karar: 2 Agent (UI sabit)

```
Kullanıcı metni
  → POST /api/chat (NDJSON stream)
    → [1] Parser:  extract_plan_input (Gemini function-calling) → PlanInput
    → [2] Planner: generate_plan (Gemini structured output)    → PlanResult (şema-kilitli)
    → formatPlanAsText(plan) → markdown (slice fallback)
    → stream → istemci
İstemci: AbortController + NDJSON reader → message.plan + content += delta
```

Sunucu taraflı Gemini (`@google/genai`), istemci gerçek stream. **Anahtar kuralı: `@google/genai` SADECE `src/lib/gemini/*` + `app/api/chat/route.ts` içinde, hepsi `import 'server-only'`.**

## Kritik Re-Entry Noktaları (kod audit)

| Dosya | Sembol | Sorun | Sprint 2 |
|---|---|---|---|
| `src/lib/bereket-mock.ts` | `createMockPlan` (199) + `PlanInput` (11) | Girdi çıktıyı etkilemiyor | `PlanInput` zaten Gemini şemasıyla uyumlu; `priorityMode` enum yap; imza `async createPlan(input): Promise<PlanResult>` |
| `bereket-prototype.tsx` | `fixedPlan` (97) + `scoreChartData` (244) | **EN BÜYÜK TUZAK**: AssistantSummary ve grafik buna bağlı; sadece `createMockPlan`'i değiştirmek yetmez | `fixedPlan` kaldır; `ChatMessage.plan?: PlanResult`; `AssistantSummary` prop-driven; `buildChartData(plan)` helper |
| `bereket-prototype.tsx` | `submitPrompt` (379) + `getRandomAssistantAnswer` (343) + `demoPromptScenarios` (145) | Cevap prompt'tan bağımsız, rastgele | `submitPrompt` async, `answer` param kalkar; gerçek fetch zinciri |
| `bereket-prototype.tsx` | `streamAssistantAnswer` (350) + timer'lar | Sahte typing (900ms + 48ms/4char) | Gerçek Gemini stream → AbortController + NDJSON reader |
| `bereket-prototype.tsx` | `AssistantSummary` (774) | Hep aynı çiziyor | `plan` prop alır; başlıklar/skorlar dinamik |

## Görev Listesi (T1–T10, doğrulama düzeltmeleri entegre)

### Kurulum
- **T1** [S]: `pnpm add @google/genai server-only` (her ikisi). `.env.local` + `.env.example` **PROJE KÖKÜNE** (`C:\Users\sawet\Desktop\134\.env.local`, ev dizinine DEĞİL — yoksa sessizce mock'a düşer). `.gitignore` `.env*` içeriyor (doğrula).

### Gemini katmanı
- **T2** [M]: `src/lib/gemini/client.ts` — tek `MODEL` sabiti (`gemini-2.5-flash`, uygulama öncesi AI Studio'dan doğrula), `import 'server-only'`, `GEMINI_API_KEY` okuma, `hasApiKey` export.
- **T3** [L]: `src/lib/gemini/schemas.ts` — `planResultSchema`: TÜM `PlanResult` alanları (`usedIngredients`, `totalCost`, `budgetRemaining`, `budgetUsagePercent 0-100`, `pantryCoverage 0-100`, `explanation`); `scores[].key` enum (`budget|waste|pantry`); `generatedAtLabel` **ÇIKAR** (UI kullanmıyor).

### Parser + Planner
- **T4** [M]: `src/lib/ai/pantry-parser.ts` — `extractPlanInput(prompt): Promise<PlanInput>`. Gemini function-calling `extract_plan_input`, `mode: 'ANY'` (tek fonksiyon), `temperature: 0`. Uydurma yasağı sistem promptu. Fiyat alanı YOK (sadece `budget`). `AbortSignal.timeout(10000)`.
- **T5** [M]: `src/lib/ai/planner.ts` — `generatePlan(input): Promise<PlanResult>`. Gemini structured output (`responseSchema: planResultSchema`), `temperature: 0` (fiyat/skor varyansını azaltır). `validatePlanResult`: 3 skor anahtarı + 0-100 aralığı; geçmezse `createMockPlan` fallback. `AbortSignal.timeout(10000)`.

### Route + format
- **T6** [S]: `src/lib/ai/format.ts` — `formatPlanAsText(plan): string` (mevcut `demoPromptScenarios.answer` template yapısı: "Yemek planı", "Eksik alışveriş listesi", "Basit skorlar").
- **T7** [M]: `app/api/chat/route.ts` — `export const maxDuration = 30`. Girdi doğrulama (`typeof string`, trim, length 1-800 değilse 400). `defaultInput` = mevcut fixedPlan girdisi (people:5, budget:900, days:5, 6 malzeme). `hasApiKey=false` → `createMockPlan(defaultInput)` + `formatPlanAsText` slice fallback. Gerçek akış: extract → generate → validate → stream. Header `X-Content-Type-Options: nosniff`. NDJSON stream (`{type:'plan'}`, `{type:'delta'}`*, `{type:'done'}`, `{type:'error', code}` — code: `no_key|parse|generate|network|quota|aborted`).

### UI (cerrahi, ikiye bölünmüş)
- **T8a** [M]: `AssistantSummary` + `ChatTurn`'u prop-driven yap — AMA `plan` prop olarak MEVCUT `fixedPlan` nesnesini geç; `fixedPlan`/satırları/`getRandomAssistantAnswer`'I SİLME; `buildChartData(fixedPlan)` kur; `pnpm build` yeşil + görsel SIFIR değişiklik doğrula.
- **T8b** [M]: ancak sonra `fixedPlan`/satırları/`getRandomAssistantAnswer`/`demoPromptScenarios.answer`'ı sil ve gerçek fetch + AbortController + NDJSON bağla. `submitPrompt` async; `streamAssistantAnswer`/timer'lar kalkar; `demoPromptScenarios` yalnızca `prompt`; `EmptyChatState.onPrompt: (prompt:string)=>void`; `ChatTurn` `message.plan != null` ile özet gösterir; mock-note Marker (satır 567) **koşullu** (gerçek plan → yumuşak metin, fallback → eski uyarı).

### Polish + test
- **T9** [S]: Header "Sprint 1" → "Sprint 2"; `metadata.description` güncelle; `AGENTS.md` "Sprint 1 Durumu" → "Sprint 2" (Gemini zinciri eklendi, mock fallback korundu); README Sprint 2 stub'ını doldur (**şablon/`---`/Sprint 3 stub'ı bozulmadan**); `docs/ornek-veri-seti.md` kısa not.
- **T10** [M]: `pnpm lint` + `pnpm build` temiz. Test matrisi: (i) anahtarsız → fallback çalışır; (ii) farklı promptlar → farklı plan; (iii) stream sırasında temizleme → temiz abort, toast yok; (iv) rate-limit/offline → `{type:'error'}` + toast + fallback; (v) demo promptlar gerçek zincire. NDJSON buffer parser için `parseNdjsonBuffer(buffer, chunk)` helper'a çek + 3 inline assertion (`node --test` ile çalışır). `docs/ornek-veri-seti.md` örneği ile parser çıktısı `PlanInput` ile birebir eşleşmeli.

## Milestone'lar

- **M1** — Parser kanıtlandı: `@google/genai` + `server-only` + `.env.local` (proje kökü) + `extractPlanInput` örnek promptu `PlanInput`'a çeviriyor; `process.env.GEMINI_API_KEY` yüklü doğrulandı.
- **M2** — Route UI'dan önce: `app/api/chat/route.ts` curl/Postman ile NDJSON döndürüyor (`plan` + `delta`* + `done`); `hasApiKey=false`'ta fallback çalışıyor. (En riskli UI değişikliği henüz başlamadı.)
- **M3** — Tam demo tarayıcıda: `bereket-prototype.tsx` rewired, gerçek stream, her mesaja özel plan, 3 bar grafik doğru renklerle.
- **M4** — Teslime hazır: lint+build temiz, fallback/error yolları test edildi, dokümantasyon güncel.

## Scope Cut (Sprint 3+'ya)

- **Türkçe tarif veri tabanı + Recipe Match** (Tasarım #2): Planner Sprint 2'de tarifleri doğrudan structured output ile üretir; recipe-match altyapısı (TheMealDB seed + ~40 tarif kürasyon + canonical malzeme sözlüğü) Sprint 3.
- **Bağımsız Shopping Agent + statik fiyat tablosu** (Tasarım #3): Planner `shoppingList`'i doğrudan üretir; mock ₺155 `createMockPlan` fallback içinde korunur. Statik fiyat tablosu + `PriceProvider` Sprint 3.
- **Canlı market fiyat MCP** (marketfiyati.org.tr): Türkiye'de herkese açık fiyat API yok, scraping ToS riskli — yalnızca resmi açılır API çıkarsa.
- **Malzeme miktar/adet parse** ("2 patates" → adet): Sprint 2'de yalnızca malzeme ADI; porsiyon hesabı Sprint 3.
- **extract+generate tek çağrıda birleştirme**: 2 ayrı agent tercih edildi (debug kolaylığı); ileri optimizasyon.
- **Gemini embedding ile anlamsal tarif eşleştirme**: leksik+alias yeterli gelirse.

## Başlıca Riskler

1. **UI kırılma (en yüksek)** — T8 bu yüzden ikiye bölündü (T8a prop-driven geçiş + T8b gerçek stream bağlama).
2. **Şema kayması** — `scores[].key` enum + `validatePlanResult` + fallback + `buildChartData` defensive (bilinmeyen key default fill).
3. **API anahtarı sızıntısı** — `@google/genai` yalnızca `server-only` dosyalarda.
4. **Gecikme** — 3 sıralı çağrı (~3-5sn ilk token); mevcut spinner kapatır; `maxDuration=30` + per-call `AbortSignal.timeout(10000)`.
5. **Halüsinasyon** — parser'da fiyat yok + planner şema-kilitli + `validatePlanResult` + fallback.
6. **TR normalizasyon** — `toLocaleLowerCase('tr')` + `Intl.Collator({sensitivity:'base'})`; "domates" vs "domates salçası" ayrımı.
7. **Model id eskimesi** — tek `MODEL` noktasında toplandı.

## Süre Tahmini (tek geliştirici)

Düzeltmelerle **3-5 odaklı gün**. Prompt iterasyonu (parser/planner system prompt'ları 2-3 tur) + T8 cerrahisi bütçelenmeli. Düzeltmesiz: ~1 gün sessiz-mock trap (env yolu) + T8'de yüksek kayma riski.
