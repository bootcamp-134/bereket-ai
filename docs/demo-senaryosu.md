# Demo Senaryoları

## Sprint 1 — Fikrin Gösterimi

### Amaç

Evdeki malzeme ve bütçeye göre yemek planlama fikrini sabit verili web prototipiyle anlatmak.

### Akış

1. Hazır sorulardan biri seçilir.
2. Beş günlük örnek plan ve alışveriş listesi gösterilir.
3. Bütçe, israf ve kiler kullanımı skorları incelenir.
4. Tema değiştirme ve sohbet temizleme gösterilir.

Bu demo yalnız Sprint 1'e ait örnek veri kullanır.

## Sprint 2 — Mobil Ürün Akışı

### Amaç

Flutter uygulamasındaki onboarding, profil, bütçe, tarif önerisi ve tarif detayı ekranlarını göstermek.

### Akış

1. Kullanıcı onboarding adımlarını tamamlar.
2. Hane bilgisi, haftalık bütçe ve yemek tercihlerini girer.
3. “Ne Yesem?” ekranında evdeki malzemeleri seçer.
4. Mock tarif listesi ve tarif detayı açılır.
5. Profil ekranı gösterilir.

Bu aşamada mobil akış mock backend verileriyle çalışır.

## Sprint 3 — Canlı Mobil Ürün

### Amaç

Gerçek tarif verisiyle çalışan Flutter uygulamasını, backend öneri akışını ve tarife özel sohbeti uçtan uca göstermek.

### Akış

1. [bereket.app](https://bereket.app) üzerinden problem ve üç sprintlik gelişim anlatılır.
2. Sistem durumu sayfasında canlı API ve tarif sayısı gösterilir.
3. Flutter uygulaması önceden hazırlanmış test hesabıyla açılır; profil, bütçe, tercih ve alerjen özeti gösterilir.
4. “Ne Yesem?” ekranında örnek malzemeler, alışveriş tercihi ve bütçe girilir.
5. Canlı önerilerden biri açılır; eşleşme, eksik malzemeler ve tahminî/kısmi maliyet açıklanır.
6. Gerçek tarif kataloğu ve tarif detayı gösterilir.
7. Seçilen tarif için kısa bir sohbet sorusu sorulur; geri dönüp aynı tarif açılarak sohbet geçmişinin korunduğu gösterilir.
8. Sprint 1 demosu açılarak ilk prototiple canlı mobil ürün arasındaki fark gösterilir.

### Beklenen Sonuç

- Canlı servis 3.005 tariflik veri setini kullanır.
- Öneriler malzeme, bütçe ve alerjen bilgisine göre değişir.
- Seçilen tarifin malzemeleri ve adımları görüntülenir.
- Tarif sohbeti yalnız seçilen tarif hakkında yanıt verir.
- Flutter istemci canlı API'nin `{data, meta}` başarı ve `{error}` hata sözleşmesini kullanır.
- Sohbet oturumu aynı tarif yeniden açıldığında geçmiş mesajları yükler.
