# Production deployment ve rollback runbook

## Altyapı

- Vercel project: `bereket-ai-api`
- Production branch: `backend`
- Domain: `api.bereket.app`
- Function region: `fra1`
- Neon: Frankfurt, Neon Auth kapalı, preview database branching açık
- Resend: manuel hesap ve doğrulanmış `mail.bereket.app` gönderim domain’i

Gerekli Vercel environment değişkenleri:

```text
DATABASE_URL
DATABASE_URL_UNPOOLED
JWT_ACCESS_SECRET
REFRESH_TOKEN_PEPPER
PASSWORD_RESET_TOKEN_PEPPER
OPENAI_SAFETY_PEPPER
CRON_SECRET
APP_BASE_URL=https://bereket.app
API_BASE_URL=https://api.bereket.app/api/v1
CORS_ORIGINS=https://bereket.app,https://www.bereket.app
RESEND_API_KEY
RESEND_FROM=Bereket AI <noreply@mail.bereket.app>
OPENAI_API_KEY
OPENAI_MODEL=gpt-5.4-mini-2026-03-17
OPENAI_MONTHLY_BUDGET_USD=5
SWAGGER_ENABLED=true
```

Secret değerleri dokümana, loga veya Git’e yazılmaz. `NEON_AUTH_BASE_URL` kullanılmaz.

## Preview release

1. Kısa ömürlü `release/*` branch’ini push et; `codex/*` branch kullanma.
2. Vercel preview deployment’ın Neon preview branch oluşturduğunu doğrula.
3. Preview direct URL ile `prisma migrate deploy` çalıştır.
4. `pnpm db:import` komutunu iki kez çalıştır; ikinci koşu değişiklik yapmamalı.
5. `RUN_DATABASE_TESTS=true pnpm test`, lint, build, Prisma validate ve audit kapılarını çalıştır.
6. Preview API’de auth, profile, recipe, recommendation ve chat smoke testi yap.
7. CI’daki fake OpenAI/Resend tam API akışının ve PostgreSQL bütçe yarış testinin geçtiğini doğrula.

## Production release

1. Migration SQL’ini destructive işlem açısından incele. Bu sürüm additive başlangıç migration’ıdır.
2. Production `DATABASE_URL_UNPOOLED` ile `pnpm db:deploy` çalıştır.
3. Production’da `pnpm db:import` çalıştır ve `/health` üzerindeki checksum/sayıyı doğrula.
4. Doğrulanmış commit’i `backend` branch’ine gönder.
5. Vercel production deployment tamamlanınca `https://api.bereket.app/api/v1/health` ve tam kullanıcı akışını test et.
6. Vercel runtime loglarında 5xx, timeout, OpenAI fallback ve Resend hatalarını request ID ile tara.
7. `GET /api/v1/internal/maintenance` cron çalışmasının yalnız doğru `CRON_SECRET` ile 200, aksi halde güvenli 404 verdiğini doğrula.

## Rollback

- Kod hatasında Vercel’de önceki başarılı deployment’ı production’a promote et.
- Dataset importu yalnız tamamlandıktan sonra aktifleşir. Gerekirse daha önceki `DatasetImport` kaydını transaction içinde tekrar `active=true`, yenisini `active=false` yap.
- Migration geri alınmaz; kod önceki additive şemayla uyumlu tutulur. Destructive schema düzeltmeleri ayrı forward migration ile yapılır.
- Token secret’ı sızdıysa ilgili secret’ı rotate et. JWT secret rotasyonu mevcut access tokenları; refresh pepper rotasyonu tüm refresh tokenları geçersiz kılar.
- Resend/OpenAI kesintisinde secret veya provider detayı kullanıcıya gösterilmez; recommendation/chat deterministic fallback ile devam eder.

## Canlı kontrol listesi

```text
GET  /api/v1/health                  200 + dataset.ready
GET  /api/docs                       200
POST /api/v1/auth/register           201
POST /api/v1/auth/login              200
POST /api/v1/auth/forgot-password    202
POST /api/v1/recommendations/recipes 200
POST /api/v1/recipe-chat/...         200
```
