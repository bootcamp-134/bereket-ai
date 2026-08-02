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

## Sprint 3 — Canlı Backend ve Agent

### Amaç

Gerçek tarif verisiyle çalışan backend, öneri akışı ve tarif sohbetini göstermek.

### Akış

1. [bereket.app](https://bereket.app) üzerinden problem ve üç sprintlik gelişim anlatılır.
2. Sistem durumu sayfasında canlı API ve tarif sayısı gösterilir.
3. [API dokümanında](https://api.bereket.app/api/docs) test hesabıyla giriş yapılır.
4. Profil bilgileri ve örnek malzemeler kaydedilir.
5. Tarif önerisi istenir ve dönen tariflerden biri açılır.
6. Seçilen tarif için kısa bir tarif sohbeti sorusu sorulur.
7. Sprint 1 demosu açılarak ilk prototiple canlı sistem arasındaki fark gösterilir.

### Beklenen Sonuç

- Canlı servis 3.005 tariflik veri setini kullanır.
- Öneriler malzeme, bütçe ve alerjen bilgisine göre değişir.
- Seçilen tarifin malzemeleri ve adımları görüntülenir.
- Tarif sohbeti yalnız seçilen tarif hakkında yanıt verir.

Mobil entegrasyon tamamlandığında 3–6. adımlar API dokümanı yerine Flutter uygulaması üzerinden gösterilecektir.
