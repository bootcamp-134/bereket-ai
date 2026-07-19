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
Sprint 2 ile birlikte prototip çalışan bir MVP'ye dönüştürülmüştür. Kullanıcı uygulamayı ilk açtığında onboarding sürecini tamamlayarak profilini oluşturur; hane bilgileri, bütçe ve yemek tercihlerini sisteme kaydeder. Kullanıcı, "Ne Yesem?" ekranında mevcut malzemelerini girerek Recipe Match algoritması sayesinde kendisine en uygun tarif önerilerini alabilir. Seçilen tarifin detayları görüntülenebilir ve "Bana Yardım Et" butonu ile yalnızca o tarife odaklanan Recipe Chat Agent üzerinden pişirme süreci hakkında destek alınabilir.
Ayrıca kullanıcılar profil ekranından bilgilerini yönetebilir, akış (Feed) ekranında hazırladıkları yemekleri fotoğraf ve yorum ile paylaşabilir, diğer kullanıcıların paylaşımlarını görüntüleyebilir ve sosyal etkileşimde bulunabilir. Bu sprintte Authentication sistemi, Supabase veritabanı, backend API'leri ve frontend-backend entegrasyonu tamamlanarak uygulamanın temel iş akışı çalışır hale getirilmiştir.
________________________________________
## Temel Kullanıcı Akışı
1.	Kullanıcı uygulamayı açar. 
2.	Onboarding sürecini tamamlayarak hesabını oluşturur. 
3.	Profil, hane bilgileri, bütçe ve yemek tercihlerini sisteme kaydeder. 
4.	"Ne Yesem?" ekranında evindeki malzemeleri girer. 
5.	Sistem Recipe Match algoritması ile en uygun yemek tariflerini önerir. 
6.	Kullanıcı tarif detaylarını görüntüler. 
7.	"Bana Yardım Et" butonu ile Recipe Chat Agent üzerinden tarif hakkında destek alır. 
8.	Kullanıcı hazırladığı yemeği akış ekranında paylaşabilir, diğer kullanıcıların gönderilerini görüntüleyebilir ve etkileşimde bulunabilir. 
________________________________________
## Başarı Ölçütleri
•	Kullanıcı onboarding sürecini başarıyla tamamlayabilir. 
•	Kullanıcı bilgileri ve tercihleri veritabanına kaydedilebilir. 
•	Kullanıcı mevcut malzemelerine göre uygun tarif önerileri alabilir. 
•	Tarif detayları görüntülenebilir ve Recipe Chat Agent kullanılabilir. 
•	Profil ve akış ekranları üzerinden temel sosyal özellikler kullanılabilir. 
•	Frontend ile backend arasında veri alışverişi sorunsuz şekilde gerçekleşir. 
•	Uygulamanın temel kullanıcı akışı (Kayıt → Onboarding → Ne Yesem? → Tarif Detayı → Recipe Chat → Feed) kesintisiz olarak çalışır.

