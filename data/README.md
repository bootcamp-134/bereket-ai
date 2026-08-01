# Bereket AI Birleşik Tarif Veri Seti

Bu veri seti, Bereket AI uygulamasının tarif önerme, stok kontrolü, porsiyon ölçekleme ve tahmini maliyet hesaplama işlemlerinde kullanılmak üzere hazırlanmıştır.

Veri setinde toplam **3.320 Türkçe tarif** ve iç içe malzemelerle birlikte **29.883 gerçek malzeme kullanımı** bulunmaktadır. Tarifler; kategori, porsiyon, hazırlama ve pişirme süreleri, pişirme yöntemi, zorluk seviyesi, malzemeler ve yapılış adımları gibi temel bilgileri içerir.

---

# Malzeme yapısı

Her malzeme kaydında hem kullanıcıya gösterilecek orijinal ölçüler hem de hesaplamalarda kullanılacak standartlaştırılmış ölçüler bulunmaktadır:

- **isim:** Tarif kaynağındaki orijinal malzeme adı.
- **miktar ve birim:** Arayüzde kullanıcıya gösterilecek orijinal tarif ölçüsü. Örneğin *“2 adet soğan”* veya *“1 yemek kaşığı salça”*.
- **quantity ve unit:** Stok ve maliyet hesaplamalarında kullanılmak üzere standartlaştırılmış miktar ve birim. Örneğin yemek kaşığıyla verilen bir malzeme gram veya mililitreye dönüştürülmüş olabilir.
- **ingredient_id:** Malzemeyi fiyat kataloğundaki ürüne bağlayan sabit ve benzersiz kimlik.
- **canonical_name:** Farklı yazımlardaki malzemelerin bağlandığı standart ürün adı. Örneğin *“kuru soğan”*, *“orta boy soğan”* veya farklı büyük-küçük harf kullanımları aynı canonical ürüne bağlanabilir.

Arayüzde tarifin özgünlüğünü korumak için **miktar** ve **birim** alanları gösterilmelidir. Stok, porsiyon ve maliyet işlemlerinde ise **quantity** ve **unit** alanları kullanılmalıdır.

---

# Birim dönüşümü ve maliyet hesaplama

Tarifteki hesaplama birimi fiyat ürününün temel birimiyle uyuşmadığında ürün bazlı dönüşüm uygulanır. Genel bir **adet → gram** katsayısı kullanılmaz; her ürün için ayrı dönüşüm tanımlanmıştır.

Örneğin iki adet soğan için:

```text
quantity: 2
unit: adet

ürün dönüşümü: 120 g/adet

cost_quantity: 240
cost_unit: g
```

## Maliyet alanlarının anlamı şöyledir:

- **cost_quantity:** Ürün bazlı dönüşüm uygulandıktan sonra fiyat hesabında kullanılan miktar.
- **cost_unit:** Fiyat hesabının yapıldığı temel birim.
- **price_per_cost_unit_try:** Bir gram, mililitre, adet, paket veya ilgili temel birim başına sentetik fiyat.
- **default_estimated_cost_try:** Malzemenin tarifin varsayılan porsiyonundaki tahmini maliyeti.
- **cost_status:** Malzemenin maliyetlendirme durumunu ve hesaplanamıyorsa nedenini gösterir.

Maliyet hesabının temel formülü şöyledir:

```text
default_estimated_cost_try =
cost_quantity × price_per_cost_unit_try
```

---

# Maliyet durumları

Her malzeme maliyet hesabından sessizce çıkarılmak yerine açık bir **cost_status** değeri taşır:

- **priced:** Malzeme tamamen maliyetlendirilmiştir.
- **missing_quantity:** Hesaplanabilir miktar bulunmamaktadır.
- **missing_unit:** Hesaplama birimi eksiktir.
- **missing_price:** Malzeme eşleşmiştir ancak kullanılabilir fiyat kaydı yoktur.
- **missing_conversion:** Fiyat vardır fakat tarif birimi fiyat birimine güvenli biçimde dönüştürülememiştir.
- **unmatched_ingredient:** Malzeme fiyat kataloğundaki bir ürüne bağlanamamıştır.
- **excluded_anomaly:** Miktar değeri anormal olduğu için otomatik düzeltilmeden maliyet hesabından çıkarılmıştır.
- **structural_heading:** “Üzeri İçin” veya “Beşamel Sos İçin” gibi gerçek malzeme olmayan bölüm başlığıdır.
- **nested_unenriched:** İç içe malzeme yapısında bulunan ancak zenginleştirilemeyen kaydı ifade eder.

Bu yapı sayesinde uygulama, eksik maliyetli bir tarifi tamamen hesaplanmış gibi göstermez.

---

# Tarif seviyesindeki maliyet özeti

Her tarifin üst seviyesinde maliyet durumunu özetleyen alanlar bulunur:

- **default_estimated_cost_try:** Maliyetlendirilebilen malzemelerin toplam tahmini maliyeti.
- **estimated_cost_is_partial:** En az bir gerçek malzeme fiyatlandırılamadıysa true olur.
- **costable_ingredient_count:** Maliyetlendirilebilen malzeme sayısı.
- **total_ingredient_count:** Bölüm başlıkları hariç gerçek malzeme sayısı.
- **cost_coverage_ratio:** Maliyetlendirilebilen malzeme sayısının toplam gerçek malzeme sayısına oranı.
- **unpriced_ingredients:** Maliyetlendirilemeyen malzemeler ve nedenleri.
- **cost_type:** Maliyetlerin sentetik tahmin olduğunu belirten **synthetic_estimate** değeri.
- **price_reference_date:** Fiyatların referans tarihi olan **2026-07-15**.

Mevcut durumda **22.253 malzeme kullanımı** maliyetlendirilebilmiş ve genel maliyet kapsaması yaklaşık **%74,47**'ye ulaşmıştır. Tariflerin **451'i tamamen**, **2.869'u ise kısmen** maliyetlendirilebilmektedir.

---

# Porsiyon kullanımı

Maliyetler tarifin veri setindeki varsayılan porsiyon değeri için hesaplanmıştır. Kullanıcı porsiyon sayısını değiştirdiğinde uygulama maliyeti şu şekilde ölçekleyebilir:

```text
ölçek katsayısı = hedef porsiyon / varsayılan porsiyon

yeni tahmini maliyet =
default_estimated_cost_try × ölçek katsayısı
```

**porsiyon_tipi:** `"batch"` olan tariflerde maliyet tek hazırlama miktarını ifade eder ve kişi sayısına göre otomatik olarak ölçeklenmemelidir. **piece**, **glass** ve benzeri porsiyon tipleri de doğrudan kişi sayısı olarak değerlendirilmemelidir.

---

# Sentetik fiyat uyarısı

Veri setindeki fiyatlar gerçek zamanlı piyasa fiyatları değildir. Uygulamanın maliyet hesaplama ve bütçe planlama akışını desteklemek için oluşturulmuş sentetik başlangıç fiyatlarıdır. Bu nedenle arayüzde fiyatlar kesin tutar olarak değil, **"Tahminî maliyet"** etiketiyle gösterilmelidir.

---

# Kullanım amacı

Bu veri seti uygulamada şu işlemleri desteklemek için hazırlanmıştır:

- Kullanıcının evindeki malzemelere göre uygun tarifleri bulmak,
- Stokta bulunan ve eksik olan malzemeleri karşılaştırmak,
- Kullanıcının kişi sayısına göre tarif miktarlarını ölçeklemek,
- Tarif ve yemek planlarının tahmini maliyetini hesaplamak.
