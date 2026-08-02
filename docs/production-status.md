# Bereket AI Production Durumu

Son doğrulama: 2 Ağustos 2026

## Canlı servis

- API: `https://api.bereket.app/api/v1`
- Swagger: `https://api.bereket.app/api/docs`
- Runtime: NestJS, Node.js 24, Vercel Function `fra1`
- Database: Neon PostgreSQL Frankfurt; Neon Auth kapalı
- Auth: Argon2id, 15 dakikalık JWT access token, 30 günlük opaque refresh rotation
- E-posta: manuel Resend hesabı ve doğrulanmış `bereket.app` gönderen domain'i
- Agent: OpenAI Responses API, `gpt-5.4-mini-2026-03-17`, structured output ve deterministic fallback

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
- `sprint-1-sprint-2-sprint-3`: ürün ve sprint dokümantasyon branch'i.

Branch geçmişleri topluca merge edilmemelidir.

## Ekipte kalan işler

- Anıl: gerçek Flutter HTTP client, secure storage, refresh mutex, nullable modeller ve Maestro staging.
- Burak: yeni dataset sürümlerinde checksum, alias, alerjen ve maliyet kapsamı doğrulaması.
- Ceren: Türkçe agent eval rubric'i ve prompt kalite değerlendirmesi.
- Samet: Vercel/Neon/Resend operasyonu, log takibi ve backend release yönetimi.
