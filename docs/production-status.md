# Bereket AI Production Durumu

Son doğrulama: 2 Ağustos 2026

## Canlı servis

- Jüri merkezi: `https://bereket.app`
- Sprint 1 demo: `https://bereket.app/sprint-1-demo`
- API: `https://api.bereket.app/api/v1`
- Swagger: `https://api.bereket.app/api/docs`
- Web runtime: Next.js 16, Node.js 24, Vercel projesi `bereket-ai-web`, production branch `sprint-3`
- API runtime: NestJS, Node.js 24, Vercel projesi `bereket-ai-api`, production branch `backend`, Function `fra1`
- Database: Neon PostgreSQL Frankfurt; Neon Auth kapalı; Production, Preview ve Development bağlı
- Auth: Argon2id, 15 dakikalık JWT access token, 30 günlük opaque refresh rotation
- E-posta: manuel Resend hesabı ve doğrulanmış `mail.bereket.app` gönderen domain'i
- Agent: OpenAI Responses API, `gpt-5.4-mini-2026-03-17`, structured output ve deterministic fallback
- Agent bütçesi: PostgreSQL üzerinde atomik aylık 5 USD rezervasyon sınırı
- Bakım: süresi dolmuş rate-limit/reset/refresh kayıtları için günlük Vercel Cron

`www.bereket.app`, kalıcı `308` ile `bereket.app` adresine yönlenir. Resend SPF, DKIM ve DMARC kayıtları Vercel DNS'tedir; parola sıfırlama akışı Resend'in kontrollü `delivered+label@resend.dev` adresiyle production üzerinde `202` ve hatasız sağlayıcı çağrısıyla doğrulanmıştır.

## Son production doğrulaması

- Health: API, database ve dataset hazır; sürüm `1.0.0-rc.1`; 3.005 tarif
- Auth: kayıt, profil tamamlama, refresh rotation ve eski token tekrar kullanımında `401`
- Agent: gerçek OpenAI ile 5 öneri ve tarif sohbeti; fallback kullanılmadı
- Güvenlik: izinsiz origin `403`, yanlış cron secret `404`, API kökü Swagger'a `308`
- Web: ana sayfa, status, privacy, reset-password ve Sprint 1 demo; framework overlay veya console hatası yok
- CI: `backend` ve `sprint-3` workflow'ları yeşil; iki production dependency audit'i temiz

## Dataset

| Ölçüm | Değer |
|---|---:|
| SHA-256 | `63c0fdf21fe854477d31aa803de9be61e901a6b6ed37609217db9b71b3278c9b` |
| Benzersiz tarif | 3.005 |
| Malzeme satırı | 27.382 |
| Fiyatlandırılmış malzeme | 21.331 |
| Tam maliyetli tarif | 513 |
| Kısmi maliyetli tarif | 2.492 |

Maliyetler tahminîdir. Eksik tutarlar `0` yapılmaz; nullable kalır. Alerjen kategorileri malzeme adlarından muhafazakâr biçimde çıkarılır ve `inferred` olarak işaretlenir.

## Canlı endpoint aileleri

- Health
- Register/login/refresh/logout/forgot-password/reset-password
- Kullanıcı ve profil
- Tarif liste/detay
- Tarif önerisi
- Kalıcı tarife özel chat

Feed ve achievements V1 kapsamında değildir.

## Branch gerçeği

- `backend`: production backend ve production agent.
- `mobile`: Flutter istemci geliştirmesi; gerçek API/token entegrasyonu tamamlanmayı bekliyor.
- `agent`: Gemini/RecipeNLG tabanlı tarihsel Python prototipi; production runtime değil.
- `sprint-1`: ilk Next.js mock prototipi.
- `sprint-2`: Sprint 1 üzerine kurulan mobil fikir ve mock backend kaydı.
- `sprint-3`: jüri merkezi, güncel ürün ve sprint dokümantasyonu; default branch.

Sprint branch’leri kümülatiftir: `sprint-1` → `sprint-2` → `sprint-3`. `codex/*`, `backend-django` ve eski birleşik sprint branch’i release sonrasında tutulmaz.

## Ekipte kalan işler

- Anıl: gerçek Flutter HTTP client, secure storage, refresh mutex, nullable modeller ve Maestro staging.
- Burak: yeni dataset sürümlerinde checksum, alias, alerjen ve maliyet kapsamı doğrulaması.
- Ceren: Türkçe agent eval rubric'i ve prompt kalite değerlendirmesi.
- Samet: Vercel/Neon/Resend operasyonu, log takibi ve backend release yönetimi.
