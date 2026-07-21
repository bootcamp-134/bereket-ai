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

Sprint 2'de uygulamanın temel kullanıcı akışı oluşturulmuş; kullanıcı onboarding süreci, profil bilgileri, hane bilgileri, bütçe tercihleri ve "Ne Yesem?" ekranı geliştirilmiştir. Tarif öneri sistemi için gerekli veri altyapısı hazırlanmış, Recipe Match Agent ve Recipe Chat Agent geliştirme çalışmaları başlatılmıştır. Backend servisleri ve Supabase veritabanı tamamlanmış olup AI destekli öneri sisteminin tam entegrasyonu sonraki sprintlerde tamamlanacaktır.

---

## Planlama Mantığı

- Kullanıcının hane kişi sayısı, bütçe ve yemek tercihleri alınır.
- Kullanıcının evinde bulunan malzemeler sisteme girilir.
- Malzemeler tarif veri setiyle karşılaştırılabilecek şekilde hazırlanır.
- Recipe Match Agent için gerekli veri yapıları ve skorlama mantığı oluşturulur.
- Tarif önerileri kullanıcıya uygun şekilde listelenebilecek altyapı hazırlanır.
- Backend servisleri ile AI bileşenlerinin entegrasyonu sonraki sprintte tamamlanacaktır.

---

## Tarif Eşleştirme Mantığı

Recipe Match Agent geliştirilirken aşağıdaki kriterler dikkate alınmıştır:

- Evde bulunan malzemelerle eşleşme oranı
- Eksik malzeme sayısı
- Tarif veri setindeki içerik bilgileri
- Kullanıcının bütçe ve yemek tercihleri

Bu kriterler doğrultusunda tarifleri sıralayacak temel skorlama mantığı oluşturulmuş, algoritmanın geliştirme çalışmaları Sprint 2 kapsamında başlatılmıştır.

---

## AI Agent Geliştirme Süreci

Sprint 2 kapsamında aşağıdaki AI bileşenlerinin geliştirme çalışmalarına başlanmıştır:

- Pantry Parser Agent
- Recipe Match Agent
- Recipe Chat Agent

Bu agentlar için temel mimari oluşturulmuş ve backend ile entegrasyon hazırlıkları yapılmıştır. Tam entegrasyonun sonraki sprintlerde tamamlanması planlanmaktadır.

---

## Örnek Değerlendirme

### Kullanıcı Bilgileri

- 5 kişilik hane
- 900 TL bütçe

### Evde Bulunan Malzemeler

- Patates
- Soğan
- Tavuk
- Yoğurt
- Domates
- Makarna
- Pirinç
- Yumurta

### Beklenen İşleyiş

- Kullanıcının girdiği bilgiler alınır.
- Malzemeler tarif veri setiyle karşılaştırılabilecek yapıya dönüştürülür.
- Recipe Match Agent tarafından kullanılacak skorlama mantığı uygulanır.
- Uygun tarif önerileri kullanıcıya listelenir.
- Recipe Chat Agent için gerekli altyapı hazırlanmış olup tam entegrasyon sonraki sprintte gerçekleştirilecektir.

---

## Sonraki Sprint Notu

- Frontend ile backend arasındaki tam entegrasyonun tamamlanması.
- Recipe Match Agent geliştirmelerinin tamamlanması ve sisteme entegre edilmesi.
- Recipe Chat Agent'ın uygulama içerisine tam olarak entegre edilmesi.
- Budget Optimizer Agent geliştirmelerine başlanması.
- Tarif önerilerinin doğruluğunu artıracak yeni veri setlerinin eklenmesi.
- Performans ve kullanıcı deneyiminin iyileştirilmesi.
