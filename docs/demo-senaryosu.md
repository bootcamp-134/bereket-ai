# Demo Senaryosu

## Amaç

Bu senaryo, Bereket AI'nın evdeki malzemeler ve bütçeye göre yemek planı oluşturma fikrini Sprint 1 prototipi üzerinden göstermek için hazırlanmıştır.

## Örnek Girdi

```text
Evde patates, soğan, tavuk, yoğurt, makarna, domates, pirinç ve yumurta var.
5 kişilik aile.
5 günlük plan.
Haftalık bütçe 900 TL.
Bozulabilecek ürünler önce kullanılsın.
```

## Beklenen Çıktı

- 5 günlük yemek planı (Tavuklu Makarna, Yoğurtlu Patates, Domatesli Makarna, Tavuklu Patates Yemeği, Sebzeli Makarna)
- Kullanılan mevcut malzemeler
- Eksik alışveriş listesi (Krema, Maydanoz, Salça, Biber)
- Tahmini ek maliyet: ₺155
- İsrafı azaltma açıklaması
- Bütçe uyumu, israf azaltma ve kiler kullanımı skorları

## Sunum Akışı

1. Ana ekrandaki hazır promptlardan biri seçilir (veya serbest metin yazılır).
2. Cevabın harf harf akması ("düşünme" animasyonu) gösterilir.
3. Chat cevabı tamamlandıktan sonra plan ve alışveriş listesi okunur.
4. Skor grafiği (Recharts) ve attachment kartları üzerinden ürünün karar desteği anlatılır.
5. Header'daki tema değiştirici ile aydınlık/karanlık geçiş gösterilir.
6. Çöp ikonuna tıklanır ve onay penceresi ile sohbet temizlenir.
