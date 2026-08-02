# Sprint 3 Review

## Tamamlananlar

- Production kullanıcı sistemi; kayıt, giriş, token yenileme, çıkış ve parola sıfırlama akışlarıyla tamamlandı.
- Profil, hane, bütçe, yemek tercihi ve alerjen bilgileri için API'ler hazırlandı.
- 3.005 benzersiz tarif ve 27.382 malzeme satırı Neon veritabanına aktarıldı.
- Malzeme eşleştirme, bütçe ve alerjen kontrolleri gerçek tarif verisiyle çalışır hâle getirildi.
- Tarif önerisi ve tarife özel sohbet akışları canlı backend üzerinde tamamlandı.
- `api.bereket.app` ve API dokümanı yayına alındı.
- Backend testleri, agent senaryoları ve canlı ortam kontrolleri tamamlandı.
- `bereket.app` jüri ve ürün merkezi olarak hazırlandı.
- Flutter mock servisleri gerçek HTTP servisleriyle değiştirildi; kayıt/giriş, profil, tarif katalog/detay, öneri ve tarif sohbeti production API'ye bağlandı.
- Access ve refresh token'lar secure storage'a alındı; refresh mutex ve güvenli oturum kapatma tamamlandı.
- Nullable/tahminî maliyet, API envelope ve kalıcı tarif sohbeti mobil modellerde karşılandı.
- `flutter analyze` hatasız, 16 otomatik test başarılı ve Android release APK derlemesi tamamlandı.

## Demo Gözlemleri

- Sağlık kontrolü canlı veritabanını ve aktif tarif sayısını doğrulamaktadır.
- Kullanıcı hesabı ve profil akışları API üzerinden uçtan uca çalışmaktadır.
- Farklı malzeme ve bütçe girdileri farklı tarif listeleri üretmektedir.
- Öneriler veri setindeki tariflerle sınırlıdır.
- Tarif sohbeti seçilen tarifin malzemeleri ve adımları üzerinden yanıt vermektedir.
- Dış model servisi kullanılamadığında temel öneri akışı devam etmektedir.
- Flutter uygulaması emülatörde canlı API ile uçtan uca çalışmaktadır.
- Aynı tarif yeniden açıldığında sohbet oturumu ve geçmiş mesajlar yüklenmektedir.

## Yayın Sürecinde Devam Edenler

- Fiziksel Android cihaz üzerinde son uçtan uca doğrulama
- Production application ID, Android imzalama ve mağaza yayını
- iOS signing/build
- Üç dakikalık jüri videosu ve liste dışı YouTube teslimi

Bu maddeler ürün özelliği geliştirmesinden ayrı release ve teslim operasyonlarıdır. Mobil production entegrasyonu tamamlanmıştır.

## Gelecek İyileştirmeler

- Gerçek kullanıcı geri bildirimiyle öneri kalitesinin ölçülmesi
- Maliyet verisi kapsamının artırılması
- Daha ayrıntılı alerjen doğrulaması
- Canlı market fiyatı için uygun ve izinli bir veri kaynağı bulunması
