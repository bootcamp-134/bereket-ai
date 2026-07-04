# Planlama Algoritması

## Sprint 1 Yaklaşımı

Sprint 1'de gerçek optimizasyon algoritması kullanılmaz. Uygulama, `src/lib/bereket-mock.ts` içindeki sabit veri ve helper fonksiyonlarıyla demo çıktısı üretir. Bu dosya, ürünün gelecekteki planlama mantığının yerini tutan bir "mock" katmanıdır.

## Mock Karar Mantığı

- Bozulma riski yüksek ürünler (Tavuk, Yoğurt) ilk günlere yerleştirilir.
- Kiler ürünleri (Makarna, Pirinç) öğün sayısını artırmak ve ek maliyeti düşürmek için omurga olarak kullanılır.
- Eksik alışveriş listesi sabit örnek fiyatlarla (Krema 45 TL, Maydanoz 15 TL, Salça 55 TL, Biber 40 TL) hesaplanır; toplam ₺155'tir.
- Skorlar bütçe, israf ve kiler kullanımı fikrini görselleştirmek için basit eşiklere göre üretilir:
  - **Bütçe Uyumu**: bütçe ≥ toplam maliyet ise 83, değilse 48.
  - **İsraf Azaltma**: bozulabilir ürünler önce kullanılacaksa 92, değilse 74.
  - **Kiler Kullanımı**: seçili malzeme sayısına göre kapsama oranı, en az 78.

## Örnek Önceliklendirme

1. Tavuk ve yoğurt erken günlere alınır.
2. Makarna ve patates düşük maliyetli ana öğün omurgası olarak kullanılır.
3. Domates ve soğan yemek tabanı olarak değerlendirilir.
4. Krema, maydanoz, salça ve biber ek alışveriş listesine eklenir.

## Gelecek Sprint Notu

Sprint 2 ve sonrası için gerçek AI entegrasyonu, kullanıcı girdisine göre dinamik tarif seçimi, kişi sayısına göre porsiyon ayarlama, veri tabanı ve gerçek fiyat kaynağı değerlendirilebilir.
