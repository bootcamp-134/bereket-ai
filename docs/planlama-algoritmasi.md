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


# Sprint 3 Yaklaşımı

Sprint 3 kapsamında mobil uygulama ile backend arasındaki entegrasyon tamamlanmış; kullanıcı kayıt ve giriş işlemleri, profil yönetimi, tarif öneri sistemi ve Agent uçtan uca çalışır hâle getirilmiştir. 

Kullanıcının girdiği bilgiler backend üzerinden işlenmekte, tarif önerileri JSON formatındaki tarif veri seti kullanılarak oluşturulmaktadır.**Recipe Chat Agent** uygulamaya entegre edilmiş; kullanıcıya kişiselleştirilmiş tarif önerileri ve tarif hakkında yapay zekâ desteği sunulmuştur.

---

##  Planlama Mantığı

1. **Kullanıcı Kaydı & Giriş:** Kullanıcı sisteme kayıt olur ve giriş yapar.
2. **Profil Oluşturma:** Kullanıcının profil bilgileri, hane kişi sayısı, haftalık bütçesi ve yemek tercihleri sisteme kaydedilir.
3. **Malzeme Girişi:** Kullanıcı *"Ne Yesem?"* ekranında evde bulunan malzemeleri sisteme girer.
4. **Veri Standartlaştırma:** Girilen malzemeler standart formata dönüştürülerek JSON tarif veri seti ile karşılaştırılır.
5. **Akıllı Eşleştirme:** **Recipe Match Agent**; malzeme eşleşmesi, eksik malzemeler, bütçe ve kullanıcı tercihlerini dikkate alarak uygun tarifleri belirler.
6. **Öneri Sunumu:** Oluşturulan tarif önerileri backend üzerinden kullanıcıya sunulur.
7. **AI Destekli Sohbet:** Kullanıcı seçtiği tarif hakkında **Recipe Chat Agent** üzerinden soru sorabilir ve tarife özel yapay zekâ desteği alabilir.

---

##  Tarif Eşleştirme Mantığı

**Recipe Match Agent** aşağıdaki kriterleri dikkate alarak tarifleri puanlar ve kullanıcıya en uygun olanları önerir:

*  **Malzeme Uyum Oranı:** Evde bulunan malzemelerle eşleşme oranı
*  **Eksik Malzeme Analizi:** Tarif için gereken eksik malzeme sayısı
*  **Veri Seti Bilgisi:** JSON tarif veri setindeki detaylı tarif bilgileri
*  **Bütçe Uyumu:** Kullanıcının haftalık bütçesi
*  **Kişisel Tercihler:** Kullanıcının yemek tercihleri ve kısıtlamaları
*  **Hane Ölçeği:** Hane kişi sayısı

---

##  AI Agent Geliştirme Süreci

Sprint 3 kapsamında aşağıdaki AI bileşenlerinin geliştirilmesi tamamlanmış ve uygulamaya entegre edilmiştir:

* **Recipe Match Agent:** Standartlaştırılmış malzemeleri ve kullanıcı kısıtlarını alarak en uygun tarifleri belirler.
* **Recipe Chat Agent:** Seçilen tarif bağlamında kullanıcının sorularını yanıtlar, alternatif malzeme önerileri ve pişirme ipuçları verir.

>  **Birlikte Çalışma Prensibi:** Bu agent senkronize çalışarak kullanıcının girdiği malzemeleri analiz etmekte, uygun tarifleri belirlemekte ve tarif hakkında kullanıcı sorularını yanıtlamaktadır.

---

##  Örnek Değerlendirme

### Kullanıcı Bilgileri & Stok
* **Hane Bilgisi:** 5 kişilik hane
* **Haftalık Bütçe:** 900 TL
* **Evdeki Malzemeler:** 
  `Patates`, `Soğan`, `Tavuk`, `Yoğurt`, `Domates`, `Makarna`, `Pirinç`, `Yumurta`

### Beklenen İşleyiş
- Kullanıcının girdiği bilgiler backend tarafından alınır.
- Malzemeler JSON tarif veri setiyle karşılaştırılır.
- **Recipe Match Agent** bütçe, hane sayısı ve malzemeleri analiz ederek uygun tarifleri belirler.
- Kullanıcıya kişiselleştirilmiş tarif önerileri listelenir.
- Kullanıcı seçtiği tarifin detaylarını görüntüler.
- **Recipe Chat Agent** üzerinden tarif hakkında soru sorabilir ve yapay zekâ destekli cevap alabilir.
