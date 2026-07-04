# Örnek Veri Seti

## Mevcut Malzemeler

- Patates
- Soğan
- Tavuk
- Yoğurt
- Makarna
- Domates
- Pirinç
- Yumurta

## 5 Günlük Plan

1. Gün: Tavuklu Makarna
2. Gün: Yoğurtlu Patates
3. Gün: Domatesli Makarna
4. Gün: Tavuklu Patates Yemeği
5. Gün: Sebzeli Makarna

## Eksik Alışveriş Listesi

- Krema: 45 TL
- Maydanoz: 15 TL
- Salça: 55 TL
- Biber: 40 TL

## Toplam Maliyet

Toplam tahmini ek alışveriş maliyeti: ₺155

## Skorlar

Skorlar sabit değildir; girdiye göre `src/lib/bereket-mock.ts` içindeki kurallarla hesaplanır. Varsayılan demo senaryosunda (bütçe ₺900 ≥ ₺155, israf önceliği açık) değerler şöyledir:

- Bütçe Uyumu: 83/100 (bütçe toplam maliyeti karşılıyorsa 83, karşılamıyorsa 48)
- İsraf Azaltma: 92/100 (bozulabilir ürünler önce kullanılacaksa 92, değilse 74)
- Kiler Kullanımı: ~96/100 (seçili malzeme sayısına göre kapsama oranı, en az 78)

## Veri Kaynağı

Bu veri seti gerçek market fiyatı veya gerçek tarif veri tabanı değildir. Sprint 1 prototipinde ürün fikrini göstermek için elle hazırlanmış mock veridir.
