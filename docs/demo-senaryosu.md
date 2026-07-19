# Demo Senaryosu

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


# Demo Senaryosu
## Amaç
Bu senaryo, Bereket AI'nın kullanıcı onboarding sürecinden başlayarak profil oluşturma, kişisel tercihlere göre tarif önerme, yapay zekâ destekli tarif yardımı sunma ve sosyal paylaşım özelliklerini Sprint 2 MVP'si üzerinden göstermesi amacıyla hazırlanmıştır.
________________________________________
Örnek Senaryo
-	Kullanıcı uygulamayı ilk kez açar. 
-	Onboarding ekranında profil bilgilerini oluşturur. 
-	Hane kişi sayısını 5 olarak girer. 
-	Haftalık bütçesini 900 TL olarak belirler. 
-	Yemek tercihlerini tamamlar. 
-	"Ne Yesem?" ekranına geçerek evde bulunan malzemeleri girer. 
Evde bulunan malzemeler:
-	Patates 
-	Soğan 
-	Tavuk 
-	Yoğurt 
-	Makarna 
-	Domates 
-	Pirinç 
-	Yumurta 
________________________________________
## Beklenen Çıktı
-	Kullanıcının bilgileri başarıyla kaydedilir. 
-	Recipe Match algoritması kullanıcı girdilerine uygun tarifleri önerir. 
-	Kullanıcı önerilen tariflerden birini seçebilir. 
-	Tarif detay ekranında malzemeler, hazırlanış adımları ve gerekli bilgiler görüntülenebilir. 
-	"Bana Yardım Et" butonu ile Recipe Chat Agent açılır ve kullanıcı tarif hakkında soru sorabilir. 
-	Kullanıcı profil ekranını görüntüleyebilir. 
-	Feed ekranında yemek paylaşımı yapabilir ve diğer kullanıcıların gönderilerini inceleyebilir. 
_______________________________________
## Sunum Akışı
1.	Uygulama açılarak onboarding süreci gösterilir. 
2.	Kullanıcı profil, hane bilgileri ve bütçe bilgileri girilir. 
3.	"Ne Yesem?" ekranına geçilerek örnek malzemeler sisteme girilir. 
4.	Sistem tarafından önerilen tarifler görüntülenir. 
5.	Bir tarif seçilerek detay ekranı açılır. 
6.	"Bana Yardım Et" butonuna basılarak Recipe Chat Agent'ın çalışma senaryosu gösterilir. 
7.	Profil ekranı açılarak kullanıcı bilgilerinin kaydedildiği gösterilir. 
8.	Feed ekranına geçilerek örnek gönderiler ve sosyal etkileşim özellikleri tanıtılır. 
9.	Uygulamanın temel kullanıcı akışı (Onboarding → Tarif Önerisi → Tarif Detayı → Recipe Chat → Feed) tamamlanarak MVP'nin çalıştığı gösterilir.
