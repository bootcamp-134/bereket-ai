# Bereket AI Backend

Bereket AI mobil uygulamasının production backend’i. NestJS, PostgreSQL/Neon, Prisma 7, kendi JWT auth sistemi, Resend ve OpenAI Responses API kullanır.

## Production durumu

- API: `https://api.bereket.app/api/v1`
- Swagger: `https://api.bereket.app/api/docs`
- Neon Auth: kapalı; kullanıcı kimliği bu uygulama tarafından yönetilir.
- Neon runtime bağlantısı pooled `DATABASE_URL`, migration/import bağlantısı `DATABASE_URL_UNPOOLED` kullanır.
- Vercel Function region: Frankfurt `fra1`.
- Resend hesabı ve domain doğrulaması manuel; secret’lar yalnız Vercel environment değişkenlerindedir.
- OpenAI modeli: `gpt-5.4-mini-2026-03-17`; aylık uygulama sınırı 5 USD ve deterministic fallback aktiftir.

## Güvenlik ve veri kuralları

- Parolalar Argon2id ile hash’lenir; access token 15 dakika, opaque refresh token 30 gündür.
- Refresh token rotation ve token-family revoke uygulanır. Reset token tek kullanımlık ve 30 dakika geçerlidir.
- JWT gerektirmeyen uçlar yalnız health ve auth işlemleridir. Kullanıcı kimliği request body’den kabul edilmez.
- Alerjen eşleşmesi muhafazakâr hard-filter’dır; veri `allergenDataStatus: "inferred"` olarak sunulur.
- Eksik fiyatlar `0` yapılmaz. Kısmi maliyetli tarifler bütçeye uygun kabul edilmez ve tüm maliyetler “Tahminî maliyet” olarak etiketlenir.
- OpenAI yalnız veritabanından güvenli biçimde seçilmiş en fazla 15 aday görür; dönüşte recipe ID’leri yeniden doğrulanır.

## Yerel geliştirme

Node.js 24 ve pnpm 11 gerekir.

```bash
pnpm install
cp .env.example .env.local
pnpm db:deploy
pnpm db:import
pnpm dev
```

Dataset importu checksum kontrollü ve idempotent’tir. Kaynak `data/recipes.json` dosyasıdır.

```bash
pnpm test
pnpm lint
pnpm build
pnpm exec prisma validate
pnpm audit --prod
```

PostgreSQL entegrasyon testleri için migration ve import sonrasında:

```bash
RUN_DATABASE_TESTS=true pnpm test
```

## V1 endpointleri

```text
GET    /health
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /me
PATCH  /me/profile
GET    /recipes
GET    /recipes/:id
POST   /recommendations/recipes
POST   /recipe-chat/sessions
GET    /recipe-chat/sessions/:sessionId/messages
POST   /recipe-chat/sessions/:sessionId/messages
```

`/feed` ve `/achievements` V1 kapsamında değildir.

## Dokümantasyon

- [API sözleşmesi](docs/api-contract.md)
- [Veri pipeline ve dataset](docs/data-pipeline.md)
- [Deployment, migration ve rollback runbook](docs/deployment.md)
- [Ekip teslimleri ve sonraki işler](docs/backend-roadmap.md)

## Geliştirici

Backend Samet DÖNMEZ ([sawetco](https://github.com/sawetco)) tarafından geliştirilmektedir.
