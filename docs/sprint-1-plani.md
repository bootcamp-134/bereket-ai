# Sprint 1 Planı

## Sprint Hedefi

Sprint 1 hedefi, Bereket AI ürün fikrini sunumda anlaşılır şekilde gösterebilen çalışan bir frontend prototipi çıkarmaktır. Bu sprintte gerçek AI, backend, database, auth, OR-Tools veya gerçek market fiyat entegrasyonu yapılmaz. Çalışma tek gün (4 Temmuz 2026) ile sınırlıdır; 29 Haziran 2026'daki fikir toplantısı sonrasında belirlenmiştir.

## Kapsam

- Chat benzeri tek sayfalık prototip (ChatGPT tarzı)
- Türkçe arayüz, varsayılan karanlık tema + aydınlık/karanlık geçiş
- Kişi, bütçe ve evdeki malzemeler fikrini temsil eden hazır demo promptları
- Serbest metin girişi, Enter ile gönderme, 800 karakter sınırı
- Mock veriyle 5 günlük yemek planı
- 8 malzemeli örnek kiler (Patates, Soğan, Tavuk, Yoğurt, Makarna, Domates, Pirinç, Yumurta)
- Eksik alışveriş listesi ve tahmini maliyet (₺155)
- Bütçe, israf azaltma ve kiler kullanımı skorları + Recharts grafiği
- Onay penceresi ile sohbet temizleme
- Prototip olduğunu açıkça belirten uyarı metinleri

## Kapsam Dışı

- Gerçek AI API entegrasyonu
- Backend geliştirme
- Database bağlantısı
- Authentication
- OR-Tools optimizasyonu
- Canlı market fiyat API'si
- Barkod, fiş fotoğrafı, PWA veya mobil uygulama
- Diyet/kalori takibi ve makine öğrenmesi

## Kabul Kriterleri

- Uygulama `pnpm run dev` ile çalışır.
- Kullanıcı hazır prompt veya kendi mesajıyla demo akışını başlatabilir.
- Sistem mock veriyle plan, alışveriş listesi, açıklama ve skorları gösterir.
- UI mobil ve masaüstünde kullanılabilir kalır.
- Arayüzde gerçek AI çalışıyormuş gibi yanıltıcı ifade bulunmaz.
