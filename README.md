# Bereket AI

Bereket AI; evdeki malzemeleri, haftalık bütçeyi ve kullanıcının belirttiği alerjenleri birlikte değerlendirerek güvenli, açıklanabilir ve ekonomik tarifler öneren yapay zekâ destekli mutfak asistanıdır. Google Yapay Zeka ve Teknoloji Akademisi Bootcamp 2026 kapsamında Takım 134 tarafından geliştirilmektedir.

## Canlı sistem

| Yüzey | Adres | Durum |
| --- | --- | --- |
| Jüri ve ürün merkezi | [bereket.app](https://bereket.app) | Sprint 3 RC |
| Production API | [api.bereket.app/api/v1](https://api.bereket.app/api/v1/health) | Canlı |
| Swagger | [api.bereket.app/api/docs](https://api.bereket.app/api/docs) | Canlı |
| Sprint 1 mock demo | [bereket.app/sprint-1-demo](https://bereket.app/sprint-1-demo) | Tarihsel demo |

Neon Auth kapalıdır. Kimlik doğrulama NestJS içinde Argon2id, kısa ömürlü JWT access token ve opaque refresh-token rotation ile yönetilir. Production agent OpenAI Responses API ve structured output kullanır; `agent` branch’i Gemini/RecipeNLG tabanlı tarihsel prototiptir.

## Üç sprintlik ürün hikâyesi

- `sprint-1`: ChatGPT benzeri Next.js/shadcn web prototipi, hazır sorular ve statik plan verisi.
- `sprint-2`: Sprint 1’in üzerine Flutter ürün akışı ve mock NestJS backend omurgası.
- `sprint-3`: Sprint 2’nin üzerine gerçek Neon verisi, production auth, güvenli OpenAI agent, tarif sohbeti ve jüri merkezi.

Bu üç branch kümülatiftir: `sprint-1` → `sprint-2` → `sprint-3`. Varsayılan branch `sprint-3` olmalıdır. Mobil kod yalnız `mobile`, production backend yalnız `backend` branch’inde geliştirilir.

## Production mimarisi

```text
Flutter mobile
    │ HTTPS + JWT
    ▼
NestJS API · Vercel fra1
    ├── Neon PostgreSQL · Frankfurt
    ├── Resend · parola sıfırlama
    └── Deterministic safety filters
            │ en fazla 15 güvenli aday
            ▼
        OpenAI Responses API
            │ structured rerank
            ▼
        Recipe ID tekrar doğrulama
```

OpenAI’ye parola, token, e-posta veya kullanıcı entity’si gönderilmez. Alerjen ve bütçe hard-filter’ları model çağrısından önce çalışır. Model hatası, timeout, rate limit, geçersiz çıktı veya aylık bütçe sınırında deterministic fallback devreye girer.

## Doğrulanmış veri seti

| Ölçüm | Değer |
| --- | ---: |
| SHA-256 | `63c0fdf21fe854477d31aa803de9be61e901a6b6ed37609217db9b71b3278c9b` |
| Benzersiz tarif | 3.005 |
| Malzeme satırı | 27.382 |
| Fiyatlandırılmış satır | 21.331 |
| Tam maliyetli tarif | 513 |
| Kısmi maliyetli tarif | 2.492 |

Eksik fiyatlar `0` yapılmaz; nullable kalır. Maliyetler tahminî, alerjen verisi muhafazakâr biçimde çıkarılmış ve `inferred` olarak işaretlenmiştir.

## Branch haritası

| Branch | Sorumluluk | Production |
| --- | --- | --- |
| `sprint-1` | İlk web mock prototipi | Hayır |
| `sprint-2` | Kümülatif Sprint 2 proje kaydı | Hayır |
| `sprint-3` | Jüri merkezi ve güncel proje dokümantasyonu | `bereket.app` |
| `backend` | NestJS, Prisma, Neon, OpenAI, Resend | `api.bereket.app` |
| `mobile` | Flutter istemci | Mobil release |
| `agent` | Tarihsel Gemini/Python prototipi | Hayır |
| `test/maestro-e2e` | Mobil staging E2E çalışması | Hayır |

`codex/*`, `backend-django` ve eski birleşik sprint branch’i kalıcı proje branch’i değildir.

## Takım 134

- Sıla KARATAŞ — Product Owner
- Burak BAŞODA — Scrum Master, veri
- Ceren KARABAĞ — Agent kalite ve değerlendirme
- Anıl DİNÇ — Flutter
- Samet DÖNMEZ — Backend ve platform

## Release gerçeği

Backend, veri importu ve production agent hazırdır. Flutter ekranları ve mock akış çalışmaları mevcuttur; gerçek HTTP client, secure token storage, refresh mutex ve staging Maestro senaryosu mobil ekip teslimidir. Bu işler tamamlanana kadar release `v1.0.0-rc.1` olarak tanımlanır.

## Yerel jüri web’i

Node.js 24 ve pnpm 10.34.5 gerekir.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm audit --prod
```

`API_BASE_URL` varsayılan olarak `https://api.bereket.app/api/v1` kullanır. Secret değeri değildir.

## Dokümantasyon

- [Doğrulanmış production durumu](docs/production-status.md)
- [Production mimarisi](docs/architecture.md)
- [Release candidate kontrol listesi](docs/release-checklist.md)
- [Sprint 1 mock demo kapsamı](docs/sprint-1-mock-demo.md)
- [Sprint 1 plan/review/retrospective](docs/sprint-1-plani.md)
- [Sprint 2 plan/review/retrospective](docs/sprint-2-plani.md)
- [Sprint 3 plan/review/retrospective](docs/sprint-3-plani.md)
- [Ürün gereksinimleri](docs/product-requirements.md)
- [Demo senaryosu](docs/demo-senaryosu.md)
- [Planlama algoritması](docs/planlama-algoritmasi.md)

Provider secret’ları, kullanıcı verileri ve gerçek tokenlar repository dokümantasyonuna yazılmaz.
