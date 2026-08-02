# **Takım İsmi**

Takım 134

# Ürün İle İlgili Bilgiler

## Takım Elemanları

- Sıla KARATAŞ: Product Owner
- Burak BAŞODA: Scrum Master
- Ceren KARABAĞ: Team Member/Developer
- Anıl DİNÇ: Team Member/Developer
- Samet DÖNMEZ: Team Member/Developer


## Ürün İsmi

- Bereket AI

## Ürün Açıklaması

- Evdeki mevcut malzemeleri, bozulma sürelerini ve haftalık bütçeyi kullanarak en az maliyetle en az gıda israfı oluşturacak yemek planı çıkaran yapay zeka destekli mutfak planlama uygulaması. YZTA Bootcamp 2026 projesi. Sprint 1'de ürün fikrini gösteren ChatGPT tarzı Türkçe web prototipi geliştirilmiştir.

## Ürün Özellikleri

- Evdeki mevcut malzemeleri serbest metin veya hızlı seçim listesiyle girme
- Malzemelerin bozulma sürelerine göre önceliklendirilmesi (önce bitecek olan kullanılır)
- Haftalık bütçeye göre en düşük maliyetli yemek planı oluşturma
- Kişi sayısına göre porsiyon/miktar otomatik ayarlama
- Alerji ve diyet kısıtlamalarına (glutensiz, vejetaryen vb.) uygun filtreleme
- Eksik malzemeler için otomatik alışveriş listesi ve tahmini fiyat çıkarma
- Her plan için "neden bu seçildi" açıklaması gösterme (maliyet, israf riski gibi)
- Beğenilmeyen tarifler için alternatif öneri isteme
- Geçmiş tercihleri (sevmediği yemekler, sık kullanılan malzemeler) hatırlama
- Haftalık plan sonunda "ne kadar uyguladın" geri bildirimi alma

## Hedef Kitle

- Bütçesini dikkatli yönetmek isteyen haneler
- Yoğun çalışan, yemek planlamaya vakit ayıramayan bireyler/çiftler
- Gıda israfını azaltmak isteyen çevre bilinçli kullanıcılar
- Kalabalık aileler (3+ kişi, haftalık alışveriş planlaması yapanlar)
- Öğrenciler ve sınırlı bütçeyle yaşayan genç yetişkinler
- 20 - 55 yaş arası, mutfakla ilgilenen ama karar yorgunluğu yaşayan kullanıcılar

## Product Backlog URL

[Jira Board](https://yzta-team-134.atlassian.net/jira/core/projects/Y1/board)

---

# Sprint 1

- **Sprint board update**: Jira board (Product Backlog URL üzerinden) ve GitHub organization/repo
(3 Temmuz 2026'da kuruldu) üzerinden takip yapılmaktadır. Ekran görüntüleri Sprint 1 sonunda
ilgili dokümantasyon klasörüne eklenecektir.

- **Backlog düzeni ve Story seçimleri**: Backlog'umuz, 4 Temmuz 2026 tarihindeki tek günlük
kısıtlı süre göz önünde bulundurularak öncelik sırasına göre düzenlenmiştir. Sprint 1'de hedef,
uçtan uca akışın (kiler girişi → mock plan → alışveriş listesi) görülebilir ve sunulabilir hale
getirilmesidir. Bu nedenle gerçek AI optimizasyonu yerine mock/statik veri kullanan story'ler
önceliklendirilmiştir. Story'ler task'lere bölünmüştür: Jira Pano'da "Yapılacaklar / Devam
Ediyor / Tamam" sütunlarında her task ayrı bilet olarak, `sprint-1` etiketiyle takip edilmektedir.

- **Daily Scrum**: Daily Scrum toplantıları zamansal sebeplerden ötürü Slack/WhatsApp
üzerinden yapılmasına karar verilmiştir. Daily Scrum toplantı notları
[Sprint 1 Daily Scrum Notları](docs/daily-scrum-notlari.md) dosyasında paylaşılacaktır.

- **Ürün Durumu**: Sprint 1'de (4 Temmuz 2026) ürün fikrini sunuma hazır şekilde gösteren
bir ChatGPT tarzı Türkçe chat prototipi teslim edilmiştir. Yukarıdaki "Ürün Özellikleri" listesi
ürünün uzun vadeli vizyonudur; Sprint 1 prototipinde gerçekleştirilenler şunlardır: Türkçe arayüz
(varsayılan karanlık tema + aydınlık/karanlık tema geçişi), hazır promptlar ve serbest metin
girişi ile sohbet akışı, mock veriyle 5 günlük yemek planı, 8 malzemeli kiler (Patates, Soğan,
Tavuk, Yoğurt, Makarna, Domates, Pirinç, Yumurta), eksik alışveriş listesi (tahmini ₺155),
bütçe/israf/kiler skorları ve Recharts grafiği, sohbet temizleme
ve erişilebilirlik (klavye desteği, odak yönetimi, prototip uyarıları).
Akışın tamamı [Sprint 1 Mock Demo](docs/sprint-1-mock-demo.md) dosyasında anlatılmaktadır.

- **Ekran Görüntüleri**:
  ![Screenshot 1](https://github.com/YZTA-134/134/blob/main/docs/1Sprint1.png)
  ![Screenshot 2](https://github.com/YZTA-134/134/blob/main/docs/1Sprint2.png)
  ![Screenshot 3](https://github.com/YZTA-134/134/blob/main/docs/1Sprint3.png)
  ![Screenshot 4](https://github.com/YZTA-134/134/blob/main/docs/1Sprint4.png)

  - **MVP Video Link**:
  ![MVP](https://github.com/YZTA-134/134/blob/main/docs/screen-capture.webm)

- **Sprint Review**: Sprint review notları
[Sprint 1 Review](docs/sprint-1-review.md) dosyasında yer alacaktır. Sprint 1'de
gerçek AI entegrasyonu, OR-Tools entegrasyonu ve canlı fiyat verisi kullanılmamış; MVP akışı
mock veriyle doğrulanmıştır.

- **Sprint Retrospective**: Sprint retrospective notları
[Sprint 1 Retrospective](docs/sprint-1-retrospective.md) dosyasında yer alacaktır.

- **Sprint Panosu Güncellemesi**: Sprint panosu ekran görüntüleri:
  ![Screenshot 5](https://github.com/YZTA-134/134/blob/main/docs/1SprintJira.png)
  ![Screenshot 6](https://github.com/YZTA-134/134/blob/main/docs/1Sprint2Jira.png)
  ![Screenshot 7](https://github.com/YZTA-134/134/blob/main/docs/1Sprint3Jira.png)

## Sprint 1 Çıktıları

* [Sprint Planı](docs/sprint-1-plani.md)
* [Product Requirements](docs/product-requirements.md)
* [Daily Scrum Notları](docs/daily-scrum-notlari.md)
* [Sprint Review](docs/sprint-1-review.md)
* [Sprint Retrospective](docs/sprint-1-retrospective.md)
* [Demo Senaryosu](docs/demo-senaryosu.md)
* [Planlama Algoritması](docs/planlama-algoritmasi.md)
* [Örnek Veri Seti](docs/ornek-veri-seti.md)
* [Sprint 1 Mock Demo](docs/sprint-1-mock-demo.md)
---

# Sprint 2

- **Sprint board update:** Sprint 2 boyunca görev takibi Jira Board üzerinden sürdürüldü ve sprint başlangıcında oluşturulan backlog güncellendi. Geliştirme sürecinde tamamlanan görevler düzenli olarak Yapılacaklar / Devam Ediyor / Tamamlandı sütunları arasında taşındı. Frontend, Backend, AI, Data Science ve dokümantasyon görevleri ayrı iş kalemleri olarak takip edildi. Sprint 2 sonunda güncel Jira Board ve GitHub repo ekran görüntüleri dokümantasyona eklendi.

- **Backlog düzeni ve Story seçimleri:** Sprint 2 backlog'u, Sprint 1'de geliştirilen statik prototipi daha işlevsel bir MVP'ye dönüştürme hedefi doğrultusunda oluşturuldu. Öncelik; kullanıcı onboarding süreci, profil oluşturma ve yönetimi, hane bilgileri ve bütçe tercihleri ekranları, "Ne Yesem?" ekranı ile tarif öneri arayüzü ve tarif detay ekranlarının geliştirilmesine verildi. Recipe Match Agent ve Recipe Chat Agent geliştirme çalışmaları sprint kapsamında başlatıldı ve temel altyapıları oluşturuldu. Story'ler geliştirici sorumluluklarına göre task'lere ayrıldı ve Jira üzerinde sprint etiketiyle takip edildi.
  
- **Daily Scrum:** Sprint 2 boyunca Daily Scrum toplantıları takım üyelerinin uygunluk durumuna göre Google Meet üzerinden gerçekleştirildi; gün içerisindeki ilerleme takibi ve engeller ise WhatsApp grubu üzerinden paylaşıldı. Daily Scrum notları Sprint 2 Daily Scrum Notları dokümanında kayıt altına alındı.

- **Ürün Durumu:** Sprint 2 sonunda uygulama, Sprint 1'de geliştirilen statik prototipe göre önemli ölçüde geliştirilmiştir. Kullanıcılar onboarding sürecini tamamlayarak hesap oluşturabilmekte; profil bilgilerini, hane bilgilerini ve bütçe tercihlerini kaydedebilmektedir. "Ne Yesem?" ekranı üzerinden malzeme ve alışveriş tercihleri girilebilmekte, tarif önerileri listelenebilmekte ve tarif detay ekranı görüntülenebilmektedir. Ayrıca kullanıcı profil ekranı geliştirilmiş ve uygulamanın temel kullanıcı akışı büyük ölçüde tamamlanmıştır.

Bereket AI Backend, Bereket AI mobil uygulamasının NestJS tabanlı backend servisidir. Kullanıcı yönetimi, onboarding, tarif önerileri, profil işlemleri, sosyal akış ve başarı sistemi için gerekli REST API altyapısını sağlar. Sprint 2 kapsamında temel backend servisleri, Authentication yapısı ve Supabase entegrasyonu tamamlanmış; AI tabanlı Recipe Match Agent ve Recipe Chat Agent geliştirmelerine başlanmıştır.

  -**Ekran Görüntüleri**:
  - ![Screenshot 8](https://github.com/bootcamp-134/bereket-ai/blob/mobile/docs/screenshots/01-welcome.png)
  - ![Screenshot 9](https://github.com/bootcamp-134/bereket-ai/blob/mobile/docs/screenshots/09-recipe-detail.png)



- **Sprint Review**: Sprint review notları
[Sprint 2 Review](docs/sprint-2-review.md) dosyasında yer almaktadır. Sprint 2 kapsamında kullanıcı onboarding süreci, profil yönetimi, tarif öneri ekranları, backend API'leri ve Supabase veritabanı tamamlanarak uygulamanın temel işlevlerini içeren çalışan bir MVP oluşturulmuştur. Ayrıca Recipe Match Agent ve Recipe Chat Agent geliştirme çalışmaları başlatılmış, frontend–backend entegrasyonu için gerekli altyapı hazırlanmıştır.

- **Sprint Retrospective**: Sprint retrospective notları
[Sprint 2 Retrospective](docs/sprint-2-retrospective.md) dosyasında yer almaktadır.

- **Sprint Panosu Güncellemesi**: Sprint panosu ekran görüntüleri:
  ![Screenshot 10](https://github.com/bootcamp-134/bereket-ai/blob/sprint-1-sprint-2/docs/2SprintJira.png)
 ![Screenshot 11](https://github.com/bootcamp-134/bereket-ai/blob/sprint-1-sprint-2/docs/2SprintJira2.png)

  ## Sprint 2 Çıktıları

* [Sprint Planı](docs/sprint-2-plani.md)
* [Product Requirements](docs/product-requirements.md)
* [Daily Scrum Notları](docs/daily-scrum-notlari.md)
* [Sprint Review](docs/sprint-2-review.md)
* [Sprint Retrospective](docs/sprint-2-retrospective.md)
* [Demo Senaryosu](docs/demo-senaryosu.md)
* [Planlama Algoritması](docs/planlama-algoritmasi.md)
* [mobile Branch](https://github.com/bootcamp-134/bereket-ai/tree/mobile)
* [backend Branch](https://github.com/bootcamp-134/bereket-ai/tree/backend)
* [agent Branch](https://github.com/bootcamp-134/bereket-ai/tree/agent)


---

# Sprint 3

**Sprint board update:** Sprint 3 boyunca görev takibi Jira Board üzerinden devam ettirilmiş, sprint başlangıcında oluşturulan backlog güncellenmiştir. Geliştirme sürecinde tamamlanan görevler düzenli olarak **Yapılacaklar / Devam Ediyor / Tamamlandı** sütunları arasında taşınmıştır. Mobil uygulama, Backend, AI, Data Science ve dokümantasyon görevleri ayrı iş kalemleri olarak takip edilmiştir. Sprint sonunda güncel Jira Board ve GitHub repo ekran görüntüleri dokümantasyona eklenmiştir.

**Backlog düzeni ve Story seçimleri:** Sprint 3 backlog'u, Sprint 2 sonunda geliştirilen çalışan MVP'nin tamamlanarak son kullanıcıya hazır hale getirilmesi amacıyla oluşturulmuştur. Öncelik; Flutter mobil uygulaması ile backend servislerinin tam entegrasyonu, Recipe Match Agent'ın tamamlanması, Pantry Parser Agent ve Safety Filter Agent'ın geliştirilmesi, Recipe Chat Agent entegrasyonu, gerçek tarif veri seti kullanımı, performans optimizasyonları, hata düzeltmeleri ve kullanıcı deneyiminin iyileştirilmesine verilmiştir. Sprint kapsamında agent mimarisi tamamlanmış, uçtan uca tarif öneri akışı oluşturulmuş ve tüm story'ler geliştirici sorumluluklarına göre task'lere ayrılarak Jira üzerinde sprint etiketiyle takip edilmiştir.

**Daily Scrum:** Sprint 3 boyunca Daily Scrum toplantıları takım üyelerinin uygunluk durumuna göre Zoom üzerinden gerçekleştirildi; gün içerisindeki ilerleme takibi ve karşılaşılan problemler Slack grubu üzerinden paylaşıldı. Daily Scrum notları Sprint 3 Daily Scrum Notları dokümanında kayıt altına alındı.

**Ürün Durumu:** Sprint 3 sonunda Bereket AI uygulaması, kullanıcıların onboarding sürecinden tarif önerilerine kadar tüm temel akışı çalışan bir MVP olarak tamamlanmıştır. Flutter mobil uygulaması ile Backend API entegrasyonu tamamlanmış, Recipe Match Agent gerçek tarif veri seti üzerinde çalışacak şekilde geliştirilmiştir. Pantry Parser Agent sayesinde kullanıcıların serbest metin olarak girdikleri malzemeler normalize edilerek tarif eşleştirme sistemine aktarılmaktadır. Safety Filter Agent ile alerji ve diyet kısıtlamalarına uygun filtreleme yapılmakta, Agent Pipeline aracılığıyla Pantry Parser Agent → Recipe Match Agent → Safety Filter Agent akışı uçtan uca çalışmaktadır. Recipe Chat Agent entegrasyonu tamamlanmış, kullanıcılar önerilen tarifler hakkında yapay zeka destekli açıklamalar alabilmektedir. Gerçek tarif veri seti, normalize edilmiş malzeme indeksi ve fiyat verileri sisteme entegre edilmiştir. Kullanılan veri seti ve ilgili dosyalar **`data/`** klasöründe yer almakta olup, veri setinin oluşturulma süreci, yapısı ve içerdiği dosyalara ilişkin ayrıntılı açıklamalar yine **`data/README.md`** dosyasında sunulmuştur. Eksik malzemeler için alışveriş listesi oluşturulmuş, mobil uygulamada performans iyileştirmeleri, hata düzeltmeleri ve genel sistem testleri tamamlanmıştır.

**Ekran Görüntüleri:**

Screenshot 12

Screenshot 13

Screenshot 14

Screenshot 15

**Sprint Review:** Sprint review notları Sprint 3 Review dosyasında yer almaktadır. Sprint 3 kapsamında Flutter mobil uygulaması, NestJS backend servisleri ve AI Agent mimarisi başarıyla entegre edilmiştir. Agent kullanılarak kullanıcıların evde bulunan malzemelerine göre güvenli ve kişiselleştirilmiş tarif önerileri sunulabilmektedir. Recipe Chat Agent entegrasyonu tamamlanmış ve Bereket AI uygulamasının final MVP sürümü oluşturulmuştur.

**Sprint Retrospective:** Sprint retrospective notları Sprint-3-Retrospective.md dosyasında yer almaktadır.

**Sprint Panosu Güncellemesi:** Sprint panosu ekran görüntüleri:

 ![Screenshot 16](https://github.com/YZTA-134/134/blob/main/docs/3SprintJira.png)

Screenshot 17

## Sprint 3 Çıktıları

* [Sprint Planı](docs/sprint-3-plani.md)
* [Product Requirements](docs/product-requirements.md)
* [Daily Scrum Notları](docs/daily-scrum-notlari.md)
* [Sprint Review](docs/sprint-3-review.md)
* [Sprint Retrospective](docs/sprint-3-retrospective.md)
* [Demo Senaryosu](docs/demo-senaryosu.md)
* [Planlama Algoritması](docs/planlama-algoritmasi.md)
* [mobile Branch](https://github.com/bootcamp-134/bereket-ai/tree/mobile)
* [backend Branch](https://github.com/bootcamp-134/bereket-ai/tree/backend)
* [agent Branch](https://github.com/bootcamp-134/bereket-ai/tree/agent)
* [test/maestro-e2e Branch](https://github.com/bootcamp-134/bereket-ai/tree/test/maestro-e2e)
---


---
