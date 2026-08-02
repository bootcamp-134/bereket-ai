# Ürün Gereksinimleri

## Ürün Tanımı

Bereket AI, kullanıcının evindeki malzemeleri, hane bilgisini, haftalık bütçesini ve yemek tercihlerini birlikte değerlendirerek uygun tarifler öneren bir mutfak asistanıdır.

## Problem

Evde ne bulunduğunu, bu malzemelerle ne pişirilebileceğini ve ne kadar ek alışveriş gerektiğini birlikte değerlendirmek zaman alır. Bu durum karar yorgunluğuna, gereksiz harcamaya ve gıda israfına yol açabilir.

## Hedef Kullanıcı

- Evdeki malzemeleri değerlendirmek isteyenler
- Haftalık mutfak bütçesini takip eden haneler
- Yemek seçerken alerjen veya beslenme tercihini gözetenler
- Hızlı ve uygulanabilir tarif önerisine ihtiyaç duyanlar

## Sprint 1 Çözümü

İlk sprintte ürün fikri, sohbet benzeri bir Next.js prototipiyle gösterildi. Hazır sorular ve sabit veriler kullanılarak 5 günlük örnek plan, alışveriş listesi ve basit skorlar sunuldu.

### Başarı Ölçütleri

- Ürün fikri kısa bir demo içinde anlaşılır.
- Malzeme, bütçe ve alışveriş ilişkisi aynı ekranda görülebilir.
- Kullanılan verinin örnek veri olduğu açıkça anlaşılır.

## Sprint 2 Çözümü

İkinci sprintte ürün mobil uygulama fikrine taşındı. Flutter ile onboarding, profil, bütçe, “Ne Yesem?”, tarif listesi ve tarif detayı ekranları hazırlandı. Mobil geliştirmeyi desteklemek için mock backend endpointleri oluşturuldu; tarif verisi ve malzeme normalizasyonu çalışmaları başlatıldı.

### Başarı Ölçütleri

- Mobil kullanıcı akışı mock veriyle tamamlanabilir.
- Kullanıcı profil, hane ve bütçe bilgilerini girebilir.
- Tarif önerisi ve tarif detayı ekranları gösterilebilir.
- Mobil ve backend ekipleri ortak bir API sözleşmesi üzerinde çalışabilir.

## Sprint 3 Çözümü

Üçüncü sprintte mock backend yerine gerçek tarif verisi kullanan production API hazırlandı ve Flutter uygulaması bu servislere bağlandı. Kullanıcı hesabı, profil, tarif kataloğu, öneri ve tarife özel sohbet aynı canlı sözleşme üzerinden uçtan uca çalışmaktadır.

### Temel Kullanıcı Akışı

1. Kullanıcı hesap oluşturur veya giriş yapar.
2. Hane, bütçe, yemek tercihi ve alerjen bilgilerini kaydeder.
3. Evindeki malzemeleri girer.
4. Sistem malzemeleri tarif kataloğuyla karşılaştırır.
5. Bütçe ve alerjen bilgisine uygun tarifleri listeler.
6. Kullanıcı bir tarifin ayrıntılarını görüntüler.
7. Seçilen tarif hakkında tarif sohbetine soru sorar.

### Başarı Ölçütleri

- Kullanıcı ve profil işlemleri canlı API üzerinde çalışır.
- Öneriler yalnız veri setindeki tariflerden oluşur.
- Bütçe ve alerjen kuralları öneriden önce uygulanır.
- Eksik fiyat bilgisi kesin maliyet gibi gösterilmez.
- Tarif sohbeti seçilen tarif bağlamında kalır.
- Dış model servisi kullanılamadığında temel tarif önerisi devam eder.
- Flutter uygulaması aynı API sözleşmesiyle uçtan uca akışı tamamlar.
- Access ve refresh token'lar secure storage içinde tutulur; eşzamanlı `401` yanıtları tek refresh isteğini paylaşır.
- Tarif sohbeti aynı tarif yeniden açıldığında önceki oturumu ve mesajları geri yükler.

## Güncel Durum

Backend, tarif verisi, agent ve Flutter mobil akışları canlı production sözleşmesiyle hazırdır. Kalan işler fiziksel cihaz doğrulaması, production imzalama, iOS build ve mağaza yayın operasyonlarıdır.
