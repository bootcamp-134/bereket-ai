# Apply the UI refinement

Bu paket `mobile` dalındaki mevcut BereketAI Flutter projesinin üzerine
uygulanır. Yeni ürün özelliği veya API bağlantısı eklemez.

## 1. Doğru projeyi ve dalı aç

```powershell
cd C:\Users\andin\Desktop\development\bereket_ai_mobile_repo
git switch mobile
git status
```

Çalışma ağacında sana ait kaydedilmemiş değişiklik varsa önce onları commit et
veya ayrı bir klasöre yedekle.

## 2. Paketi uygula

ZIP dosyasının içindeki `lib`, `test` ve Markdown dosyalarını
`bereket_ai_mobile_repo` köküne kopyala. Windows aynı adlı dosyalar için
onay istediğinde değiştirilen dosyaların üzerine yazılmasına izin ver.

Örnek hedefler:

- `lib/theme/app_theme.dart`
- `lib/screens/welcome_screen.dart`
- `lib/screens/recommendation_results_screen.dart`
- `test/ui_resilience_test.dart`
- `UI_REVIEW_CHECKLIST.md`

## 3. Biçimlendir ve doğrula

```powershell
dart format lib test
flutter analyze
flutter test
flutter run -t lib/main.dart
```

`flutter analyze` yeni bir hata göstermemeli ve tüm testler geçmelidir.

## 4. Elle kontrol et

- 320 piksel genişliğe yakın küçük bir emülatörde taşma olmadığını kontrol et.
- En uzun tarif adlarının iki veya daha fazla satıra düzgün kırıldığını gör.
- Sonuç bulunamadığında açıklama ile `Bilgileri Değiştir` eylemini kontrol et.
- Profil yüklenirken sayfa yapısını taklit eden iskeleti kontrol et.
- Kullanıcıya görünen hiçbir metinde `mock`, `demo`, `prototip` veya Jira kodu
  bulunmadığını kontrol et.
- Giriş ve kayıt alanlarına çok uzun metin yapıştırıldığında alanların sınırı
  uyguladığını kontrol et.

## 5. Değişiklikleri incele

```powershell
git status
git diff --stat
git diff
```

Sonuçları onayladıktan sonra kendi commit mesajını kullanarak commit ve push
yapabilirsin.
