# Release Candidate Kontrol Listesi

## Backend

- [x] Prisma migration additive ve preview veritabanında doğrulandı
- [x] Dataset importu iki koşuda idempotent
- [x] Auth, refresh rotation/reuse, profil, tarif, öneri ve chat testleri
- [x] Gerçek OpenAI preview smoke testi fallback olmadan geçti
- [x] Dependency audit temiz
- [x] Production deployment ve `api.bereket.app` son smoke testi

## Web ve domain

- [x] `sprint-1`, `sprint-2`, `sprint-3` kümülatif branch’leri
- [x] Sprint 1 mock demo ayrı rotada
- [x] Canlı status, reset-password ve privacy rotaları
- [x] Next.js build, lint ve production audit
- [x] `bereket-ai-web` Vercel projesi ve `bereket.app` domain geçişi
- [x] `www.bereket.app` kalıcı `308` yönlendirmesi

## Sağlayıcılar

- [x] Neon Auth kapalı
- [x] Production + Preview + Development Neon bağlantısı
- [x] Resend SPF/DKIM gönderim domain’i
- [x] DMARC kaydı ve kontrollü Resend teslimat smoke testi

## Mobil kapanış

- [x] Gerçek API client
- [x] Secure token storage ve refresh mutex
- [x] Nullable model/error envelope uyumu
- [x] Kayıt/giriş, profil, tarif katalog/detay, öneri ve kalıcı sohbet akışları
- [x] Flutter analyze, 16 otomatik test ve Android release APK
- [ ] Staging Maestro E2E
- [ ] Fiziksel Android cihaz doğrulaması ve production imzalama
- [ ] iOS signing/build ve mağaza yayın operasyonları

Mobil ürün geliştirmesi tamamlandı. Fiziksel cihaz, imzalama ve mağaza yayın adımları kapanana kadar release etiketi `v1.0.0-rc.1` olarak kalır.
