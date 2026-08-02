# Release Candidate Kontrol Listesi

## Backend

- [x] Prisma migration additive ve preview veritabanında doğrulandı
- [x] Dataset importu iki koşuda idempotent
- [x] Auth, refresh rotation/reuse, profil, tarif, öneri ve chat testleri
- [x] Gerçek OpenAI preview smoke testi fallback olmadan geçti
- [x] Dependency audit temiz
- [ ] Production deployment ve `api.bereket.app` son smoke testi

## Web ve domain

- [x] `sprint-1`, `sprint-2`, `sprint-3` kümülatif branch’leri
- [x] Sprint 1 mock demo ayrı rotada
- [x] Canlı status, reset-password ve privacy rotaları
- [x] Next.js build, lint ve production audit
- [ ] `bereket-ai-web` Vercel projesi ve `bereket.app` domain geçişi
- [ ] `www.bereket.app` yönlendirmesi

## Sağlayıcılar

- [x] Neon Auth kapalı
- [x] Production + Preview Neon bağlantısı
- [ ] Neon Development environment bağlantısı
- [x] Resend SPF/DKIM gönderim domain’i
- [ ] DMARC kaydı ve teslim edilen reset e-postası doğrulaması

## Mobil kapanış

- [ ] Gerçek API client
- [ ] Secure token storage ve refresh mutex
- [ ] Nullable model/error envelope uyumu
- [ ] Staging Maestro E2E

Mobil maddeler tamamlanana kadar release etiketi `v1.0.0-rc.1` olarak kalır.
