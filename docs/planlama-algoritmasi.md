# Planlama Algoritması

## Sprint 1 Yaklaşımı

Sprint 1'de gerçek optimizasyon algoritması kullanılmaz. Uygulama, `src/lib/bereket-mock.ts` içindeki sabit veri ve helper fonksiyonlarıyla demo çıktısı üretir. Bu dosya, ürünün gelecekteki planlama mantığının yerini tutan bir "mock" katmanıdır.

## Mock Karar Mantığı

- Bozulma riski yüksek ürünler (Tavuk, Yoğurt) ilk günlere yerleştirilir.
- Kiler ürünleri (Makarna, Pirinç) öğün sayısını artırmak ve ek maliyeti düşürmek için omurga olarak kullanılır.
- Eksik alışveriş listesi sabit örnek fiyatlarla (Krema 45 TL, Maydanoz 15 TL, Salça 55 TL, Biber 40 TL) hesaplanır; toplam ₺155'tir.
- Skorlar bütçe, israf ve kiler kullanımı fikrini görselleştirmek için basit eşiklere göre üretilir:
  - **Bütçe Uyumu**: bütçe ≥ toplam maliyet ise 83, değilse 48.
  - **İsraf Azaltma**: bozulabilir ürünler önce kullanılacaksa 92, değilse 74.
  - **Kiler Kullanımı**: seçili malzeme sayısına göre kapsama oranı, en az 78.

## Örnek Önceliklendirme

1. Tavuk ve yoğurt erken günlere alınır.
2. Makarna ve patates düşük maliyetli ana öğün omurgası olarak kullanılır.
3. Domates ve soğan yemek tabanı olarak değerlendirilir.
4. Krema, maydanoz, salça ve biber ek alışveriş listesine eklenir.

## Gelecek Sprint Notu

Sprint 2 ve sonrası için gerçek AI entegrasyonu, kullanıcı girdisine göre dinamik tarif seçimi, kişi sayısına göre porsiyon ayarlama, veri tabanı ve gerçek fiyat kaynağı değerlendirilebilir.


# Sprint 2 Yaklaşımı
Sprint 2'de yemek planlama süreci, kullanıcı onboarding sırasında alınan bilgiler ile "Ne Yesem?" ekranında girilen mevcut malzemelerin birlikte değerlendirilmesi üzerine kurulmuştur. Tarif önerileri Recipe Match algoritması tarafından oluşturulurken, bütçe uygunluğu Budget Optimizer algoritması ile desteklenmiştir. Kullanıcı, önerilen tarif hakkında Recipe Chat Agent üzerinden ek bilgi alabilmektedir.
________________________________________
## Planlama Mantığı
-	Kullanıcının hane kişi sayısı, bütçe ve yemek tercihleri dikkate alınır. 
-	Kullanıcının evinde bulunan malzemeler analiz edilir. 
-	Malzemeler tarif veri setindeki tariflerle karşılaştırılır. 
-	En fazla malzeme eşleşmesine sahip tarifler önceliklendirilir. 
-	Bütçeye uygun tarifler daha yüksek öncelik alır. 
-	Tarifler oluşturulan skor formülüne göre sıralanarak kullanıcıya sunulur. 
________________________________________
## Tarif Eşleştirme Mantığı
Recipe Match algoritması aşağıdaki kriterleri dikkate alarak öneri oluşturur:
-	Evde bulunan malzemelerle eşleşme oranı 
-	Eksik malzeme sayısı 
-	Tahmini maliyet 
-	Kullanıcının bütçesi 
-	Yemek tercihleri 
Bu kriterlerden elde edilen skorlar kullanılarak en uygun tarifler kullanıcıya önerilir.
________________________________________
## Budget Optimizer
Budget Optimizer algoritması;
-	Kullanıcının belirlediği bütçeyi dikkate alır. 
-	Tariflerin tahmini maliyetlerini karşılaştırır. 
-	Daha düşük maliyetli ve daha yüksek eşleşmeye sahip tarifleri önceliklendirir. 
________________________________________
## Recipe Chat Agent
Kullanıcı önerilen tariflerden birini seçtikten sonra "Bana Yardım Et" özelliğini kullanabilir.
Recipe Chat Agent;
-	Seçilen tarif özelinde çalışır. 
-	Tarifin hazırlanışı hakkında bilgi verir. 
-	Pişirme aşamalarını açıklar. 
-	Malzeme alternatifleri ve temel pişirme önerileri sunar. 
________________________________________
## Örnek Değerlendirme
Kullanıcı Bilgileri
-	5 kişilik hane 
-	900 TL bütçe 
Evde Bulunan Malzemeler
-	Patates 
-	Soğan 
-	Tavuk 
-	Yoğurt 
-	Domates 
-	Makarna 
-	Pirinç 
-	Yumurta 
## Algoritma Sonucu
-	Malzemeler tarif veri setiyle karşılaştırılır. 
-	En yüksek eşleşme skoruna sahip tarifler belirlenir. 
-	Bütçe uygunluğu kontrol edilir. 
-	Kullanıcıya en uygun tarif önerileri sıralanır. 
-	Seçilen tarif için Recipe Chat Agent üzerinden destek alınabilir. 
________________________________________
## Sonraki Sprint Notu
-	Tarif önerilerinin doğruluğunu artıracak yeni veri setlerinin eklenmesi. 
-	Recipe Match algoritmasının daha gelişmiş puanlama yöntemleriyle iyileştirilmesi. 
-	Recipe Chat Agent'ın daha kapsamlı tarif desteği sunacak şekilde geliştirilmesi.
