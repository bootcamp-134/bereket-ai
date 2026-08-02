# Güvenlik Politikası

## Desteklenen sürüm

Aktif olarak yalnız `v1.0.0-rc.1` ve onu izleyen en güncel release candidate desteklenir. Tarihsel `sprint-1`, `sprint-2` ve `agent` branch’leri production güvenlik desteği almaz.

## Güvenlik açığı bildirimi

Güvenlik açığını herkese açık issue olarak paylaşmayın. GitHub repository üzerindeki private vulnerability reporting kanalını kullanın. Bildirime yeniden üretim adımlarını, etkilenmiş endpoint veya commit’i ve olası etkiyi ekleyin; gerçek kullanıcı verisi, API key veya token eklemeyin.

## Secret yönetimi

- Neon, Resend ve OpenAI secret’ları yalnız Vercel environment değişkenlerinde tutulur.
- `NEON_AUTH_BASE_URL` kullanılmaz; Neon Auth kapalıdır.
- Loglarda parola, access/refresh/reset tokenı veya provider secret’ı bulunmamalıdır.
- Secret sızıntısında ilgili değer derhal rotate edilir; refresh pepper rotasyonu mevcut refresh oturumlarını geçersiz kılar.
