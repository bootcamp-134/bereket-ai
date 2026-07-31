# BereketAI UI review checklist

Bu belge yeni bir özellik tanımlamaz. `mobile` dalındaki mevcut ekranların
aynı tasarım kararlarını koruması için kısa bir inceleme standardıdır.

## Marka ve renk

- Renkler yalnızca `lib/theme/app_theme.dart` içindeki `AppColors` üzerinden
  seçilir.
- Ana eylem ve seçili durumlarda orman yeşili kullanılır.
- Hasat rengi yalnızca küçük vurgu veya uyarı işaretidir.
- Gradyan yalnızca `BrandMark` içinde kullanılabilir.
- Nötr metin ve kenarlıklar saf gri değil, yeşile yakın tonlardır.

## Tipografi ve Türkçe

- Boyutlar 12, 14, 16, 18, 24 ve 32 basamaklarından seçilir.
- Gövde metinlerinde satır yüksekliği en az 1.4 olur.
- Uzun içerik sola hizalanır; ortalama kısa giriş ve boş durumlarla sınırlıdır.
- Otomatik büyük harf dönüşümü kullanılmaz.
- Her ekran en az 320 piksel genişlikte uzun Türkçe metinle denenir.

## Düzen ve bileşenler

- Kontroller 12, kartlar 16 yarıçap kullanır; hap biçimi yalnızca küçük bilgi
  etiketlerinde kullanılır.
- Kenarlık yeterliyse gölge eklenmez.
- Tek ikon ailesi olarak Material Symbols kullanılır; emoji kullanılmaz.
- Üç eşit tanıtım kartı yerine içerik önemine göre satır, bölüm veya liste
  düzeni tercih edilir.

## İçerik ve durumlar

- Kullanıcıya görünen metinlerde `mock`, `demo`, `prototip` veya Jira kodu
  bulunmaz.
- Örnek tarif adları ve tutarlar değişken uzunlukta ve yuvarlak olmayan
  değerler içerir.
- Boş durum ne olduğunu açıklar ve tek bir çıkış eylemi sunar.
- Yükleniyor durumu yalnızca dönen simge yerine ekran iskeletini gösterir.
- Hata metni ne olduğunu ve kullanıcının sonraki adımını açıklar.

## Etkileşim ve güvenlik

- Tüm dokunulabilir ikonların erişilebilir açıklaması (`tooltip`) bulunur.
- Bekleme sırasında birincil eylem tekrar gönderimi engeller.
- Metin alanları istemci tarafında uzunluk ve biçim kontrolü uygular.
- İstemci doğrulaması güvenlik sınırı değildir; gerçek API eklendiğinde aynı
  kontroller sunucuda da zorunludur.

## Birleştirme öncesi

```powershell
dart format lib test
flutter analyze
flutter test
```

Ardından küçük ekran, büyük yazı ölçeği, boş sonuç ve en uzun Türkçe içerik
elle kontrol edilir.
