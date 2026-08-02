# Sprint 2 Planı

## Sprint Hedefi

Sprint 1'de doğrulanan ürün fikrini mobil uygulama akışına taşımak ve mobil ekibin kullanabileceği backend servislerini hazırlamak.

## Kapsam

- Flutter onboarding, profil, bütçe ve yemek tercihi ekranları
- “Ne Yesem?” tarif önerisi akışı
- Tarif listesi ve tarif detay ekranları
- Kullanıcı kayıt ve giriş servisleri
- Profil, tarif, öneri ve tarif sohbeti için mock API'ler
- Tarif verisi, fiyat verisi ve malzeme normalizasyonu çalışmaları
- Agent akışlarının görev ve veri yapısı tasarımı

## Kapsam Dışı

- Mobil uygulamanın canlı backend ile production entegrasyonu
- Gerçek tarif verisiyle çalışan öneri sistemi
- Canlı market fiyatı
- Barkod veya fiş okuma
- Uygulama mağazası yayını

## Görev Dağılımı

| Alan | Sorumluluk |
| --- | --- |
| Ürün | Sprint backlog, kullanıcı akışları ve kabul kriterleri |
| Veri | Tarif ve fiyat verisi, malzeme normalizasyonu |
| Agent | Tarif eşleştirme ve tarif sohbeti akış tasarımı |
| Mobil | Flutter ekranları ve mock kullanıcı akışı |
| Backend | Auth, profil, tarif, öneri ve sohbet endpointleri |

## Kabul Kriterleri

- Kullanıcı mobil uygulamada onboarding ve profil akışını tamamlayabilir.
- “Ne Yesem?” ekranı mock veriyle tarif önerileri gösterebilir.
- Tarif detayı ve profil ekranları kullanılabilir durumdadır.
- Backend endpointleri mobil entegrasyona uygun bir sözleşme sunar.
- Sprint 3'te gerçek veri ve agent entegrasyonuna geçmek için gerekli veri yapıları belirlenmiştir.

## Başlıca Riskler

- Mobil ve backend modellerinin farklılaşması
- Tarif malzemelerindeki yazım farklılıkları
- Mock akış ile gerçek API davranışının karıştırılması
- Agent çalışmalarının gerçek veri setinden önce tamamlanmaya çalışılması
