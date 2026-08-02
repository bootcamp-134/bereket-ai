# Tarif Öneri Yaklaşımı

## Sprint 1

İlk prototip sabit veriler kullanır. Kullanıcı hangi soruyu seçerse seçsin aynı 5 günlük örnek plan ve alışveriş listesi gösterilir. Bu aşamanın amacı algoritma geliştirmek değil, ürün fikrini görünür kılmaktır.

## Sprint 2

Mobil kullanıcı akışı ve mock backend hazırlanırken gerçek tarif önerisi için gerekli veri yapıları belirlendi. Tarif isimleri, malzemeler, fiyatlar ve yazım farklılıkları üzerinde normalizasyon çalışmaları yapıldı.

## Sprint 3

Canlı öneri akışı şu sırayla çalışır:

1. Kullanıcının malzemeleri ortak yazım biçimine dönüştürülür.
2. Tarif kataloğunda malzeme eşleşmesi yapılır.
3. Yemek tercihine uymayan ve alerjen riski taşıyan tarifler çıkarılır.
4. Evdeki malzemelerle hazırlanabilen veya az alışveriş gerektiren tarifler öne alınır.
5. Bütçe kullanılıyorsa yalnız yeterli fiyat bilgisi olan tarifler karşılaştırılır.
6. En uygun adaylar kısa açıklamalarla sıralanır.
7. Sonuçtaki tarif kimlikleri veri setine karşı yeniden kontrol edilir.

## Tarif Sohbeti

Tarif sohbeti yalnız kullanıcının seçtiği tarifin adı, malzemeleri ve hazırlanış adımlarını kullanır. Böylece sohbet öneri listesinden bağımsız yeni bir tarif uydurmaz; seçilen tarif hakkında alternatif malzeme ve pişirme sorularına odaklanır.

## Hata Durumu

Dış model servisi geçici olarak kullanılamazsa sistem malzeme eşleşmesine dayalı temel sıralamayla yanıt vermeye devam eder. Kullanıcı boş ekran veya teknik sağlayıcı hatasıyla karşılaşmaz.

## Veri Sınırları

- Tarif maliyetleri tahminîdir; canlı market fiyatı değildir.
- Eksik fiyatlar sıfır kabul edilmez.
- Alerjen bilgisi veri setinden çıkarılmış bir ön kontroldür; kullanıcı ürün etiketini ayrıca doğrulamalıdır.
- Öneri sistemi sağlık veya beslenme uzmanı tavsiyesi yerine geçmez.
