# Sprint 1 Daily Scrum Notları

## Daily Scrum Formatı

Toplantılar kısa sprint süresi ve uzaktan çalışma nedeniyle Slack/WhatsApp üzerinden asenkron ilerletilecektir. Her takım üyesi aşağıdaki üç soruya yanıt verir:

- Dün ne yaptım?
- Bugün ne yapacağım?
- Önümde engel var mı?

Aşağıda önce projenin fikir ve isimlendirme toplantısı (29 Haziran 2026), ardından Sprint 1 planlama/geliştirme toplantısı (4 Temmuz 2026) özetlenmiştir.

## 29 Haziran 2026 — Proje Fikri ve İsimlendirme Toplantısı

Takım, proje fikrini belirlemek için bir toplantı yaptı; toplantıya katılamayan üyeler Slack grubundan fikirlerini paylaştı.

| İsim | Rol | Katkı |
|---|---|---|
| Sıla KARATAŞ | Product Owner | Toplantıya katılamadı; Slack grubuna ürün yönü ve hedef kitle üzerine görüşlerini yazdı. |
| Burak BAŞODA | Scrum Master | Toplantıya katıldı; Slack grubuna "evdeki malzemeler + bütçe + israf azaltma" temalı mutfak planlayıcı fikrini (şu anki proje) sundu; fikir kabul edildi. |
| Ceren KARABAĞ | Team Member/Developer | Toplantıya katıldı, fikirler sundu ve projeye "Bereket AI" geçici ismini önerdi. |
| Anıl DİNÇ | Team Member/Developer | Toplantıya katıldı, sunulan fikirleri değerlendirdi. |
| Samet DÖNMEZ | Team Member/Developer |  Toplantıya katılamadı, sunulan fikirleri değerlendirdi. |

> Not: "Bereket AI" ismi Ceren KARABAĞ tarafından önerilmiş geçici bir isimdir ve tüm katılımcılar tarafından henüz onaylanmamıştır.

## 3 Temmuz 2026 — Altyapı ve Dokümantasyon Kurulumu

| İsim | Rol | Katkı |
|---|---|---|
| Sıla KARATAŞ |  Product Owner | GitHub organization + repo kurulumu, README dokümantasyonu. |

## 4 Temmuz 2026 — Sprint 1 Planlama ve Geliştirme

Tüm takımın katıldığı toplantıda projenin Sprint 1'de sunması gerekenler belirlendi; herkes kendi rolüyle ilgili katkı ve fikirlerini paylaştı.

| İsim | Rol | Katkı |
|---|---|---|
| Sıla KARATAŞ | Product Owner | Ürün öncelikleri, MVP kapsamı ve hedef kitle tanımına katkı verdi. |
| Burak BAŞODA | Scrum Master | Next.js + shadcn/ui (Base UI) proje kurulumu; ChatGPT tarzı Türkçe sohbet prototipi; aydınlık/karanlık tema; mock veriyle 5 günlük plan, alışveriş listesi ve skorlar; Recharts grafiği; sohbet temizleme akışı; erişilebilirlik; README ve Sprint 1 dokümantasyonu |
| Ceren KARABAĞ | Team Member/Developer | Proje ismi ve Türkçe arayüz diline dair görüş; demo içeriği fikirleri. |
| Anıl DİNÇ | Team Member/Developer | Sprint 1 kapsamı ve mock veri içeriği üzerine görüşler. |
| Samet DÖNMEZ | Team Member/Developer | Demo senaryosu ve sunum akışı üzerine görüşler. |

## Engel Notları

- Gerçek AI, backend ve market fiyatı entegrasyonları Sprint 1 dışında bırakıldı.
- Demo verisinin gerçek veriyle karıştırılmaması için arayüzde prototip uyarıları korundu.


# Sprint 2 Daily Scrum Notları

## Daily Scrum Formatı

Sprint 2 boyunca toplantılar takım üyelerinin uygunluk durumuna göre Zoom üzerinden gerçekleştirildi; gün içerisindeki gelişmeler ve görev takipleri ise Slack grubu üzerinden sürdürüldü.

Her takım üyesi günlük olarak aşağıdaki üç soruya cevap verdi:

- Dün ne yaptım?
- Bugün ne yapacağım?
- Önümde engel var mı?

Aşağıda Sprint 2 planlama toplantısı ile sprint boyunca gerçekleştirilen geliştirme süreci özetlenmiştir.

---

# 4 Temmuz 2026 — Sprint 2 Planlama Toplantısı

Sprint 2'nin başlangıcında takım bir araya gelerek Sprint 1 çıktıları değerlendirildi ve geliştirilecek yeni özellikler belirlendi. Prototipin çalışan bir MVP'ye dönüştürülmesi amacıyla görev dağılımı yapıldı.

| İsim | Rol | Katkı |
|------|-----|-------|
| **Sıla KARATAŞ** | Product Owner | Sprint Backlog'unu güncelledi, kullanıcı akışlarını yeniden düzenledi, Sprint 2 hedeflerini belirledi ve görev dağılımını oluşturdu. |
| **Burak BAŞODA** | Data Scientist | Tarif öneri algoritması, veri setleri, skorlama sistemi ve bütçe optimizasyonu üzerine yapılacak çalışmaları planladı. |
| **Ceren KARABAĞ** | AI Engineer | Recipe Match Agent ve Recipe Chat Agent'ın görevleri ile çalışma senaryolarını belirledi. |
| **Anıl DİNÇ** | Mobile Developer | Onboarding, profil, **"Ne Yesem?"**, tarif detay ve akış ekranlarının kullanıcı deneyimi tasarımlarını planladı. |
| **Samet DÖNMEZ** | Backend Developer | Authentication sistemi, API mimarisi, Supabase veritabanı ve frontend-backend entegrasyonu için teknik planlamayı gerçekleştirdi. |

> **Not:** Sprint 2 planlama toplantısında Sprint 1 çıktıları değerlendirilmiş ve tüm takım üyeleri kendi geliştirme alanlarına göre görevlerini üstlenmiştir.

# 5–19 Temmuz 2026 — Sprint 2 Geliştirme Süreci

Sprint boyunca ekip üyeleri kendi sorumluluk alanlarında geliştirme çalışmalarını yürüttü ve ilerleme durumlarını düzenli olarak paylaştı.

| İsim | Rol | Katkı |
|------|-----|-------|
| **Sıla KARATAŞ** | Product Owner | Sprint Backlog'unu ve Jira Board'u güncelledi, Daily Scrum notlarını hazırladı, Sprint Review ve Sprint Retrospective dokümanlarını oluşturdu, demo senaryosu ile kullanıcı akışlarını güncelledi ve Sprint 2 test senaryolarını hazırladı. |
| **Burak BAŞODA** | Data Scientist | Tarif veri setini hazırladı, malzeme isimlerini normalize etti, fiyat veri setini oluşturdu, Recipe Match algoritmasının temel skor mantığını geliştirdi ve benchmark çalışmalarını hazırladı. |
| **Ceren KARABAĞ** | AI Engineer | Pantry Parser Agent, Recipe Match Agent ve Recipe Chat Agent geliştirme çalışmalarını başlattı. Agent mimarisini ve yapay zekâ akışını tasarladı, temel altyapıları oluşturdu. |
| **Anıl DİNÇ** | Mobile Developer | Onboarding ekranları, kullanıcı profil oluşturma akışı, hane bilgileri, bütçe ve tercih ekranları, **"Ne Yesem?"** ekranı, tarif öneri ekranı, tarif detay ekranı ve profil ekranını geliştirdi. Mobil uygulamanın temel kullanıcı akışını mock verilerle çalışır hale getirdi. |
| **Samet DÖNMEZ** | Backend Developer | Authentication API'leri, kullanıcı API'leri, onboarding API'si, tarif API'leri, tarif öneri API'si, Recipe Chat API'si, Feed API'si ve Achievement API'lerini geliştirdi. Supabase veritabanını yapılandırdı ve frontend–backend entegrasyonu için gerekli altyapıyı hazırladı. |

> **Not:** Sprint boyunca görev ilerlemeleri Daily Scrum toplantıları ve **Slack** üzerinden düzenli olarak takip edildi.

# Engel Notları

- Backend ve mobil uygulama için ortak veri modeli oluşturulurken bazı alanlarda düzenlemeler yapıldı.
- Recipe Match algoritmasının doğruluğunu artırmak amacıyla tarif veri setinde malzeme normalizasyonu gerçekleştirildi.
- AI Agent geliştirme sürecinde veri yapıları ve servis mimarisi oluşturularak sonraki sprintte tamamlanacak entegrasyon için gerekli hazırlıklar yapıldı.
- Sprint hedeflerini etkileyen kritik bir teknik engel yaşanmadı; ekip planlanan görevleri koordineli şekilde yürüttü.


# Sprint 3 Daily Scrum Notları

## Daily Scrum Formatı

Sprint 3 boyunca toplantılar takım üyelerinin uygunluk durumuna göre Zoom üzerinden gerçekleştirildi; gün içerisindeki gelişmeler ve görev takipleri ise Slack grubu üzerinden sürdürüldü.

Her takım üyesi günlük olarak aşağıdaki üç soruya cevap verdi:

- Dün ne yaptım?
- Bugün ne yapacağım?
- Önümde engel var mı?

Aşağıda Sprint 3 planlama toplantısı ile sprint boyunca gerçekleştirilen geliştirme ve tamamlanma süreci özetlenmiştir.

---

## 20 Temmuz 2026 — Sprint 3 Planlama Toplantısı

Sprint 3'ün başlangıcında takım bir araya gelerek Sprint 2 çıktıları değerlendirildi. Son sprint kapsamında uygulamanın eksik kalan geliştirmelerinin tamamlanması, sistem entegrasyonlarının yapılması, test süreçlerinin yürütülmesi ve proje teslim dokümanlarının hazırlanması planlandı.

| İsim | Rol | Katkı |
|------|------|--------|
| **Sıla KARATAŞ** | Product Owner | Sprint Backlog'unu güncelledi, son sprint hedeflerini belirledi, görev dağılımını organize etti ve teslim sürecini planladı. |
| **Burak BAŞODA** | Data Scientist | Tarif veri setinin son düzenlemelerini, maliyet hesaplama yapısını ve veri doğrulama çalışmalarını planladı. |
| **Ceren KARABAĞ** | AI Engineer | Agent mimarisinin tamamlanması, agent entegrasyonları ve yapay zekâ akışlarının son hâline getirilmesini planladı. |
| **Anıl DİNÇ** | Mobile Developer | Mobil uygulamanın son kullanıcı deneyimi düzenlemeleri ve backend entegrasyonlarını planladı. |
| **Samet DÖNMEZ** | Backend Developer | API entegrasyonlarının tamamlanması, veritabanı düzenlemeleri ve sistem testlerini planladı. |

> **Not:** Sprint 3 planlama toplantısında proje teslimine yönelik son geliştirmeler, entegrasyon çalışmaları ve teslim süreci önceliklendirildi.

---

## 20 Temmuz – 2 Ağustos 2026 — Sprint 3 Geliştirme Süreci

Sprint boyunca ekip üyeleri kendi sorumluluk alanlarındaki son geliştirmeleri tamamladı, sistem entegrasyonlarını gerçekleştirdi ve proje teslimi için gerekli dokümantasyon çalışmalarını yürüttü.

| İsim | Rol | Katkı |
|------|------|--------|
| **Sıla KARATAŞ** | Product Owner | Sprint Backlog'u ve Jira Board'u güncelledi, Daily Scrum notlarını hazırladı, Sprint Review ve Sprint Retrospective dokümanlarını oluşturdu, README dosyasını düzenledi, GitHub deposunun son düzenlemelerini gerçekleştirdi, test senaryolarını tamamladı, 3 dakikalık proje tanıtım videosu ile ürün teslim formlarının hazırlanma sürecini koordine etti ve proje teslimini yönetti. |
| **Burak BAŞODA** | Data Scientist | Tarif veri setini son hâline getirdi, maliyet hesaplama yapısını tamamladı, veri doğrulama ve benchmark çalışmalarını güncelledi. |
| **Ceren KARABAĞ** | AI Engineer | Agent geliştirmelerini tamamladı, agent entegrasyonlarını gerçekleştirdi ve yapay zekâ akışlarını son hâline getirdi. |
| **Anıl DİNÇ** | Mobile Developer | Mobil uygulamanın backend entegrasyonlarını tamamladı, kullanıcı arayüzü iyileştirmelerini gerçekleştirdi ve uygulamayı teslim sürümüne hazırladı. |
| **Samet DÖNMEZ** | Backend Developer | API geliştirmelerini tamamladı, veritabanı yapılandırmasını son hâline getirdi, frontend-backend entegrasyonlarını tamamladı ve sistem testlerini gerçekleştirdi. |

> **Not:** Sprint boyunca tamamlanan geliştirmeler düzenli Daily Scrum toplantıları ve Slack üzerinden takip edilmiş, proje teslimine yönelik son kontroller gerçekleştirilmiştir. Sprint sonunda 3 dakikalık proje tanıtım videosu hazırlanmış, ürün teslim formları tamamlanmış ve proje başarıyla teslim edilmiştir.

---

## Engel Notları

- Backend, mobil uygulama ve AI servisleri arasındaki entegrasyon süreçlerinde ortaya çıkan küçük uyumsuzluklar giderildi.
- Veri seti ve maliyet hesaplama yapısı son kez doğrulanarak sistemle uyumlu hâle getirildi.
- Teslim öncesinde kullanıcı senaryoları ve temel fonksiyon testleri tamamlandı.
- 3 dakikalık tanıtım videosu ve ürün teslim dokümanları ekip koordinasyonu ile zamanında tamamlandı.
- Sprint sonunda planlanan tüm hedefler tamamlanmış ve proje teslime hazır hâle getirilmiştir.
