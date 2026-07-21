# Demo Senaryosu-1

## Amaç

Bu senaryo, Bereket AI'nın evdeki malzemeler ve bütçeye göre yemek planı oluşturma fikrini Sprint 1 prototipi üzerinden göstermek için hazırlanmıştır.

## Örnek Girdi

```text
Evde patates, soğan, tavuk, yoğurt, makarna, domates, pirinç ve yumurta var.
5 kişilik aile.
5 günlük plan.
Haftalık bütçe 900 TL.
Bozulabilecek ürünler önce kullanılsın.
```

## Beklenen Çıktı

- 5 günlük yemek planı (Tavuklu Makarna, Yoğurtlu Patates, Domatesli Makarna, Tavuklu Patates Yemeği, Sebzeli Makarna)
- Kullanılan mevcut malzemeler
- Eksik alışveriş listesi (Krema, Maydanoz, Salça, Biber)
- Tahmini ek maliyet: ₺155
- İsrafı azaltma açıklaması
- Bütçe uyumu, israf azaltma ve kiler kullanımı skorları

## Sunum Akışı

1. Ana ekrandaki hazır promptlardan biri seçilir (veya serbest metin yazılır).
2. Cevabın harf harf akması ("düşünme" animasyonu) gösterilir.
3. Chat cevabı tamamlandıktan sonra plan ve alışveriş listesi okunur.
4. Skor grafiği (Recharts) ve attachment kartları üzerinden ürünün karar desteği anlatılır.
5. Header'daki tema değiştirici ile aydınlık/karanlık geçiş gösterilir.
6. Çöp ikonuna tıklanır ve onay penceresi ile sohbet temizlenir.


# Demo Senaryosu-2

## Amaç

Bu senaryo, Bereket AI'nın Sprint 2 kapsamında geliştirilen mobil uygulama arayüzlerini, kullanıcı onboarding sürecini, profil oluşturma akışını, tarif öneri ekranlarını ve backend altyapısını tanıtmak amacıyla hazırlanmıştır. Ayrıca AI Agent geliştirmeleri için oluşturulan temel altyapının gösterilmesi hedeflenmektedir.

---

## Örnek Senaryo

- Kullanıcı uygulamayı ilk kez açar.
- Onboarding ekranında profil bilgilerini oluşturur.
- Hane kişi sayısını **5** olarak girer.
- Haftalık bütçesini **900 TL** olarak belirler.
- Yemek tercihlerini tamamlar.
- **"Ne Yesem?"** ekranına geçerek evde bulunan malzemeleri girer.

**Evde bulunan malzemeler:**

- Patates
- Soğan
- Tavuk
- Yoğurt
- Makarna
- Domates
- Pirinç
- Yumurta

---

## Beklenen Çıktı

- Kullanıcı onboarding sürecini tamamlayabilir.
- Profil, hane bilgileri ve bütçe tercihleri görüntülenebilir.
- Kullanıcının girdiği malzemelere göre tarif önerileri listelenebilir.
- Kullanıcı önerilen tariflerden birini seçebilir.
- Tarif detay ekranında malzemeler, hazırlanış adımları ve tarif bilgileri görüntülenebilir.
- Backend servisleri ve AI Agent entegrasyonu için hazırlanan altyapı tanıtılır.
- Profil ekranı görüntülenebilir.

---

## Sunum Akışı

1. Uygulama açılarak onboarding süreci gösterilir.
2. Kullanıcı profil, hane bilgileri ve bütçe bilgileri girilir.
3. **"Ne Yesem?"** ekranına geçilerek örnek malzemeler sisteme girilir.
4. Sistem tarafından önerilen tarifler görüntülenir.
5. Bir tarif seçilerek detay ekranı açılır.
6. Profil ekranı açılarak kullanıcı bilgilerinin görüntülenmesi gösterilir.
7. Backend API yapısı, Supabase veritabanı ve AI Agent geliştirme süreci kısaca tanıtılır.
8. Uygulamanın temel kullanıcı akışı (**Onboarding → Profil → Ne Yesem? → Tarif Önerileri → Tarif Detayı**) gösterilerek Sprint 2 çıktıları sunulur.
