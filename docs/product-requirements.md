# Product Requirements

## Ürün Tanımı

Bereket AI, kullanıcının evdeki mevcut malzemelerini, kişi sayısını, haftalık bütçesini ve gıdaların bozulma riskini dikkate alarak düşük maliyetli ve israfı azaltan yemek planı öneren mutfak planlama uygulamasıdır.

## Problem

Kullanıcılar evde hangi malzemelerin olduğunu, bu malzemelerle ne pişirebileceğini, ne kadar ek alışveriş gerektiğini ve bütçesini aşıp aşmayacağını tek bir yerden planlayamıyor. Bu durum karar yorgunluğu, gıda israfı ve gereksiz harcamaya yol açıyor.

## Sprint 1 Çözümü

Sprint 1 prototipi, ChatGPT tarzı bir sohbet arayüzü üzerinden kullanıcıdan malzeme ve bütçe bilgisini alıyormuş gibi davranır. Kullanıcının yazdığı mesaj veya seçtiği hazır prompt, sabit (mock) bir yemek planı cevabıyla yanıtlanır. Amaç ürün fikrini uçtan uca akan bir prototip üzerinde göstermektir; gerçek AI veya canlı veri kullanılmaz.

## Temel Kullanıcı Akışı

1. Kullanıcı Bereket AI prototipini açar (varsayılan karanlık tema ile).
2. Hazır demo promptlarından birini seçer veya kendi mesajını yazar.
3. Sistem, cevap hazırlanırken kısa bir "düşünme" animasyonu gösterir.
4. Asistan cevabı harf harf akar; altında 5 günlük yemek planı, eksik alışveriş listesi, tahmini maliyet, "neden bu plan?" açıklaması ve üç skor (bütçe/israf/kiler) içeren bir özet paneli ile Recharts grafiği belirir.
5. İstendiğinde header'daki tema değiştirici ile aydınlık/karanlık tema, çöp ikonu üzerinden açılan onay penceresi ile de sohbet temizleme kullanılabilir.

## Başarı Ölçütleri

- Ürün fikri 1 dakikalık demo içinde anlaşılır.
- Kullanıcı mevcut malzeme, bütçe, israf ve alışveriş maliyeti ilişkisini aynı ekranda görebilir.
- Sprint 1 prototipinin gerçek veri veya AI entegrasyonu olmadığı arayüzde açıkça belirtilir.

# Sprint 2 Çözümü

Sprint 2 ile birlikte uygulamanın temel mobil arayüzleri, backend servisleri ve veri altyapısı önemli ölçüde geliştirilmiştir. Kullanıcı uygulamayı ilk açtığında onboarding sürecini tamamlayarak profilini oluşturabilir; hane bilgileri, bütçe ve yemek tercihlerini girebilir. Kullanıcı, "Ne Yesem?" ekranında mevcut malzemelerini girerek tarif önerilerini görüntüleyebilir ve seçilen tarifin detaylarını inceleyebilir.

Bu sprintte Authentication sistemi, Supabase veritabanı ve backend API'leri tamamlanmış; Recipe Match Agent ve Recipe Chat Agent geliştirme çalışmaları başlatılarak temel altyapıları oluşturulmuştur. Mobil uygulama şu anda temel kullanıcı akışını mock veriler üzerinden desteklemekte olup frontend–backend ve AI agent entegrasyonlarının tamamlanması sonraki sprintlerde hedeflenmektedir.

---

## Temel Kullanıcı Akışı

1. Kullanıcı uygulamayı açar.
2. Onboarding sürecini tamamlayarak hesabını oluşturur.
3. Profil, hane bilgileri, bütçe ve yemek tercihlerini girer.
4. "Ne Yesem?" ekranında evindeki malzemeleri girer.
5. Sistem tarif önerilerini kullanıcıya listeler.
6. Kullanıcı tarif detaylarını görüntüler.
7. Backend ve AI servisleri için gerekli altyapı hazırlanmış olup tam entegrasyon sonraki sprintte tamamlanacaktır.

---

## Başarı Ölçütleri

- Kullanıcı onboarding sürecini başarıyla tamamlayabilir.
- Kullanıcı profil, hane bilgileri ve bütçe tercihlerini girebilir.
- "Ne Yesem?" ekranı üzerinden tarif önerileri görüntülenebilir.
- Tarif detay ekranı görüntülenebilir.
- Authentication sistemi, backend API'leri ve Supabase veritabanı başarıyla geliştirilmiştir.
- Recipe Match Agent ve Recipe Chat Agent geliştirme çalışmaları başlatılmıştır.
- Mobil uygulamanın temel kullanıcı akışı mock veriler kullanılarak başarıyla çalışmaktadır.
- Frontend, backend ve AI bileşenlerinin tam entegrasyonu için gerekli altyapı oluşturulmuştur.


#  Sprint 3 Çözümü

Sprint 3 ile birlikte Bereket AI'nın temel kullanıcı akışı tamamlanmıştır. Mobil uygulama ile backend servisleri arasındaki entegrasyon sağlanmış, kullanıcı kayıt ve giriş işlemleri, onboarding süreci, profil yönetimi, tarif öneri sistemi ve Recipe Chat Agent aynı uygulama içerisinde çalışır hâle getirilmiştir. Kullanıcının girdiği malzemeler JSON formatındaki tarif veri seti ile karşılaştırılarak Recipe Match Agent tarafından değerlendirilmekte ve uygun tarif önerileri oluşturulmaktadır. Kullanıcı ayrıca seçtiği tarif hakkında Recipe Chat Agent üzerinden yapay zekâ desteği alabilmektedir.

---

##  Temel Kullanıcı Akışı

1. Kullanıcı uygulamayı açar.
2. Hesabına giriş yapar veya yeni hesap oluşturur.
3. Onboarding sürecünü tamamlayarak profil bilgilerini oluşturur.
4. Hane bilgileri, haftalık bütçesi ve yemek tercihlerini sisteme kaydeder.
5. "Ne Yesem?" ekranında evinde bulunan malzemeleri girer.
6. Sistem, JSON formatındaki tarif veri setini kullanarak uygun tarif önerilerini kullanıcıya listeler.
7. Kullanıcı önerilen tariflerden birini seçerek tarif detaylarını görüntüler.
8. Recipe Chat Agent üzerinden tarif hakkında soru sorabilir ve yapay zekâ destekli yardım alabilir.

---

##  Başarı Ölçütleri

*  Kullanıcı kayıt ve giriş işlemlerini başarıyla gerçekleştirebilir.
*  Onboarding süreci ve profil oluşturma akışı tamamlanabilir.
*  Kullanıcının profil, hane bilgileri ve bütçe tercihleri sisteme kaydedilebilir.
*  Kullanıcının girdiği malzemelere göre tarif önerileri oluşturulabilir.
*  Tarif detay ekranı görüntülenebilir.
*  Recipe Match Agent, JSON tarif veri setini kullanarak uygun tarifleri önerebilir.
*  Recipe Chat Agent, seçilen tarif hakkında kullanıcı sorularını yanıtlayabilir.
*  Mobil uygulama, backend servisleri ve AI bileşenleri entegre şekilde çalışmaktadır.

---

> **Sonuç:** Projenin hedeflenen temel kullanıcı akışı uçtan uca başarıyla tamamlanmıştır.
