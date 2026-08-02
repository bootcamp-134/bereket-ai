# Sprint 3 Teknik Planı

Bu plan, Sprint 2 sonunda geliştirilen backend servisleri, mobil uygulama ve AI altyapısını tamamlayarak uçtan uca çalışan bir ürün ortaya çıkarmak için hazırlandı. Sprint 3 kapsamında Recipe Match Agent ve Recipe Chat Agent uygulamaya entegre edildi, mobil uygulama ile backend arasındaki veri akışı tamamlandı ve JSON formatındaki tarif veri seti kullanılarak dinamik tarif önerileri oluşturuldu. Sprint sonunda ürünün tüm temel kullanıcı akışı tamamlanarak proje teslimine hazır hâle getirildi.

## Sprint Hedefi

Sprint 2 sonunda hazırlanan altyapıyı tamamlayarak;

- Mobil uygulama ile backend servisleri arasındaki entegrasyonu tamamlamak.
- Recipe Match Agent'ı JSON tarif veri seti ile çalışır hâle getirmek.
- Recipe Chat Agent'ı tarif detay ekranına entegre etmek.
- Authentication ve kullanıcı profil yönetimini tamamlamak.
- Temel kullanıcı akışını uçtan uca çalışır hâle getirerek projeyi teslim etmek.

## Mimari Karar

Kullanıcı

→ Flutter Mobile

→ REST API

→ Authentication (JWT)

→ Profile Service

→ Recipe Service

→ Recipe Match Agent

→ JSON Recipe Dataset

→ Recipe Chat Agent

→ Sonuç → Mobil Uygulama

Mobil uygulama yalnızca backend API'leri üzerinden haberleşmektedir. Tarif önerileri JSON veri seti kullanılarak oluşturulmakta, Recipe Chat Agent ise seçilen tarif bağlamında kullanıcı sorularını yanıtlamaktadır.

---

## Kritik Geliştirme Noktaları

| Modül | Geliştirme | Sprint 3 |
|-------|------------|-----------|
| Authentication | JWT Login/Register | Tamamlandı |
| Profile | Profil yönetimi | Backend ile entegre edildi |
| Recipe Service | Tarif servisleri | JSON veri seti ile çalışacak şekilde tamamlandı |
| Recipe Match Agent | Tarif önerileri | Tamamlandı |
| Recipe Chat Agent | AI destekli tarif yardımcısı | Tamamlandı |
| Mobile Integration | Flutter + Backend | Tamamlandı |

---

# Görev Listesi (T1–T10)

## Authentication

**T1 [S]**

- JWT Authentication tamamlandı.
- Register ve Login servisleri tamamlandı.
- Kullanıcı oturum yönetimi geliştirildi.

---

## Profile

**T2 [M]**

Kullanıcı bilgilerinin backend üzerinden yönetilmesi.

- Profil
- Hane bilgileri
- Haftalık bütçe
- Yemek tercihleri

---

## Recipe Dataset

**T3 [M]**

JSON formatındaki tarif veri setinin sisteme entegre edilmesi.

- Tarif bilgileri
- Malzemeler
- Hazırlanış adımları
- Tarif kategorileri

---

## Recipe Match Agent

**T4 [L]**

Recipe Match Agent'ın tamamlanması.

Değerlendirme kriterleri;

- Malzeme eşleşme oranı
- Eksik malzemeler
- Kullanıcı bütçesi
- Yemek tercihleri
- Hane kişi sayısı

---

## Recipe Service

**T5 [M]**

Recipe servislerinin tamamlanması.

- Tarif listeleme
- Tarif detayları
- Tarif filtreleme

---

## Recipe Chat Agent

**T6 [M]**

Recipe Chat Agent'ın uygulamaya entegre edilmesi.

Kullanıcı;

- Tarif hakkında soru sorabilir.
- Alternatif malzemeler öğrenebilir.
- Hazırlama önerileri alabilir.

---

## Mobile Integration

**T7 [L]**

Flutter uygulamasındaki ekranların backend servisleri ile tamamen entegre edilmesi.

- Login
- Onboarding
- Profil
- Ne Yesem?
- Tarif Önerileri
- Tarif Detayı
- Recipe Chat

---

## Testing

**T8 [M]**

Sistem testlerinin gerçekleştirilmesi.

Test senaryoları;

- Kullanıcı kayıt
- Kullanıcı giriş
- Profil yönetimi
- Tarif önerileri
- Tarif detayları
- Recipe Chat
- API hata yönetimi

---

## Optimization

**T9 [S]**

Sistem performansının iyileştirilmesi.

- API yanıt süreleri
- JSON veri erişimi
- Mobil kullanıcı deneyimi

---

## Documentation

**T10 [S]**

README, Jira, Sprint dokümanları ve proje dokümantasyonunun güncellenmesi.

---

# Milestone'lar

### M1

Authentication sistemi ve kullanıcı yönetimi tamamlandı.

### M2

Mobil uygulama ile backend entegrasyonu tamamlandı.

### M3

Recipe Match Agent JSON veri seti ile çalışır hâle getirildi.

### M4

Recipe Chat Agent uygulamaya başarıyla entegre edildi.

### M5

Temel kullanıcı akışı uçtan uca tamamlandı.

### M6

Testler, dokümantasyon ve son kontroller tamamlanarak proje başarıyla teslim edildi.

---

# Kapsam Dışı

Aşağıdaki geliştirmeler proje kapsamı dışında bırakılmıştır.

- Gerçek zamanlı market fiyat entegrasyonu
- Barkod veya fiş okuma desteği
- Gelişmiş öneri algoritmaları
- Çoklu dil desteği
- Gelişmiş kişiselleştirilmiş öneri sistemi

---

# Başlıca Riskler

- JSON veri setindeki eksik tarif bilgilerinin öneri doğruluğunu etkilemesi
- Recipe Match Agent'ın öneri kalitesinin veri setine bağlı olması
- API hata yönetimi
- Mobil uygulama ile backend arasındaki bağlantı sorunları
- Recipe Chat Agent'ın beklenmeyen kullanıcı girdilerine verdiği yanıtlar

---

# Süre Tahmini

Tek geliştirici bazında yaklaşık **4–5 odaklı gün** planlanmıştır.

Sprint sonunda backend servisleri, mobil uygulama, AI bileşenleri, test süreçleri ve proje dokümantasyonu tamamlanarak ürün teslim edilmiştir.
