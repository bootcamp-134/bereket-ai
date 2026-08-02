# Production teslim durumu ve ekip işleri

## Backend kapsamı

Bu branch gerçek Neon/PostgreSQL repository’leri, Argon2id/JWT/refresh rotation auth, Resend parola sıfırlama, checksum import, tarif API’si, güvenli deterministic recommendation, OpenAI structured-output rerank, kalıcı tarif sohbeti, rate-limit ve standart envelope içerir.

V1’de feed ve achievements yoktur. `agent` branch’indeki Gemini/RecipeNLG kodu tarihsel prototiptir ve production runtime’a merge edilmez.

## Test kapıları

- Unit: normalization, alerjen inference, DTO kuralları, refresh reuse/concurrency ve reset concurrency.
- API contract/E2E: JWT koruması, error envelope ve endpoint allowlist.
- PostgreSQL integration: migration, idempotent import, checksum/sayılar, nullable maliyet, chat ownership, transaction ve rate-limit.
- Agent eval: 30 Türkçe alerjen, bütçe, prompt injection, geçersiz ID, privacy ve fallback vakası.
- CI: fake/no-op OpenAI ve Resend, gerçek PostgreSQL service; hiçbir provider secret’ı gerekmez.
- Release: kontrollü hesapla gerçek OpenAI ve Resend smoke testi.

## Ekip teslimleri

### Anıl — Flutter

- Gerçek HTTP client ve V1 modelleri.
- Secure token storage, tek refresh mutex ve 401 retry sınırı.
- Nullable maliyet/süre/porsiyon, enum ve error envelope uyumu.
- Profile, recommendation, no-result/fallback ve recipe chat ekran durumları.
- Staging Maestro uçtan uca senaryosu.

### Burak — veri

- Dataset checksum ve sayaçlarının bağımsız doğrulaması.
- Alias/canonical ingredient çakışma raporu.
- Alerjen eşlemesi ve maliyet kapsamı fixture review.
- Yeni dataset için version/change log.

### Ceren — agent kalite

- `test/agent-eval.fixture.ts` içindeki 30 vakayı insan değerlendirme rubric’iyle puanlama.
- Türkçe gerekçe doğruluğu, gereksiz kesinlik ve prompt-injection sonuçlarının gözden geçirilmesi.
- Yeni failure örneklerini fixture’a regresyon vakası olarak ekleme.

### Samet — altyapı ve release

- Neon Auth kapalı, preview branching ve Frankfurt ayarlarını koruma.
- Resend `bereket.app` SPF/DKIM ve Vercel env yönetimi.
- Preview migration/import, live smoke, log taraması ve `backend` release’i.

## Branch stratejisi

- `backend`: production backend.
- `codex/backend-production-ready`: doğrulama/preview branch’i.
- default branch: production durumunu ve gerçek dataset sayılarını anlatan ayrı documentation PR.
- `agent`: Gemini/RecipeNLG’nin tarihsel prototip olduğunu belirten ayrı documentation PR.

Branch geçmişleri topluca merge edilmez.
