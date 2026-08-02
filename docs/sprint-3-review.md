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

## Demo Gözlemleri

- Sağlık kontrolü canlı veritabanını ve aktif tarif sayısını doğrulamaktadır.
- Kullanıcı hesabı ve profil akışları API üzerinden uçtan uca çalışmaktadır.
- Farklı malzeme ve bütçe girdileri farklı tarif listeleri üretmektedir.
- Öneriler veri setindeki tariflerle sınırlıdır.
- Tarif sohbeti seçilen tarifin malzemeleri ve adımları üzerinden yanıt vermektedir.
- Dış model servisi kullanılamadığında temel öneri akışı devam etmektedir.

## Devam Edenler

- Flutter uygulamasındaki mock servislerin canlı API ile değiştirilmesi
- Mobil token saklama ve yenileme akışının tamamlanması
- Mobil cihaz üzerinde uçtan uca test
- Android/iOS teslim sürümünün hazırlanması

Bu maddeler mobil ekip sorumluluğundadır. Backend sözleşmesi ve canlı servisler entegrasyon için hazırdır.

## Gelecek İyileştirmeler

- Gerçek kullanıcı geri bildirimiyle öneri kalitesinin ölçülmesi
- Maliyet verisi kapsamının artırılması
- Daha ayrıntılı alerjen doğrulaması
- Canlı market fiyatı için uygun ve izinli bir veri kaynağı bulunması
