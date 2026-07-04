# Sprint 1 Mock Demo

## Demo Türü

Next.js 16 + React 19 + shadcn/ui (Base UI) ile geliştirilmiş tek sayfalık frontend prototipidir. Varsayılan tema karanlıktır; aydınlık/karanlık geçiş desteklenir.

## Çalıştırma

```bash
pnpm install
pnpm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Kullanılan Ana Bileşenler

- `MessageScroller`, `Message`, `Bubble`
- `Attachment`, `Marker`, `Badge`
- `InputGroup`, `Button`, `Tooltip`, `AlertDialog`
- `ChartContainer` + Recharts
- `Toaster` (sonner) ile bildirimler

## Demo Özellikleri

- Rastgele seçilen empty state başlığı ve açıklaması
- Sayfa açılışında karışan hazır demo prompt sırası
- Boş promptta devre dışı kalan gönder butonu (800 karakter sınırı)
- Prototip olduğunu belirten sohbet marker'ı
- Harf harf akan mock plan cevabı ve skor grafiği
- Aydınlık/karanlık tema değiştirme
- Onay penceresi ile sohbet temizleme
- Klavye desteği, odak yönetimi ve "İçeriğe geç" erişilebilirlik bağlantısı

## Önemli Not

Bu demo gerçek AI, backend, database veya gerçek market fiyat verisi kullanmaz. Arayüzdeki tüm çıktılar Sprint 1 prototipi için hazırlanmış örnek veriye dayanır.
