# Tarif veri pipeline’ı

## Doğrulanmış dataset

Kaynak: `data/recipes.json`

| Ölçüm                  |                                                              Değer |
| ---------------------- | -----------------------------------------------------------------: |
| SHA-256                | `63c0fdf21fe854477d31aa803de9be61e901a6b6ed37609217db9b71b3278c9b` |
| Benzersiz tarif        |                                                              3.005 |
| Malzeme satırı         |                                                             27.382 |
| Fiyatlandırılmış satır |                                                             21.331 |
| Tam maliyetli tarif    |                                                                513 |
| Kısmi maliyetli tarif  |                                                              2.492 |

Tariflerin `rec_*`, malzemelerin `ing_*` kimlikleri korunur. Import beklenen checksum ve dört temel sayıyı doğrulamadan veritabanına yazmaz.

## Import davranışı

```bash
pnpm db:deploy
pnpm db:import
```

Import:

1. Dosya checksum ve kayıt sayılarını doğrular.
2. Aynı tamamlanmış checksum zaten aktifse değişiklik yapmadan çıkar.
3. Ingredient ve alias kayıtlarını tekrar güvenli biçimde oluşturur.
4. Tarifleri stable ID ile upsert eder; malzeme ve adımları transaction içinde yeniler.
5. Tüm tarifler tamamlandıktan sonra yeni dataset sürümünü atomik olarak aktif eder.

Başarısız veya yarım import aktif dataset’i değiştirmez. `DatasetImport` kaydı provenance, checksum, sayılar ve tamamlanma zamanını tutar.

## Maliyet semantiği

Eksik tutarlar nullable kalır; bilinmeyen maliyet `0` değildir. API şunları ayrı sunar:

- `amountTry`
- `isPartial`
- `coverageRatio`
- `reliability`
- `priceReferenceDate`
- `label: "Tahminî maliyet"`

Bir öneride eksik malzemelerden herhangi biri fiyatlandırılmamışsa tarif bütçe filtresinden geçmez.

## Alerjen semantiği

Dataset doğrulanmış alerjen etiketi içermediği için canonical malzeme adlarından muhafazakâr çıkarım yapılır. Kategoriler gluten, süt, yumurta, balık, kabuklu deniz ürünü, yer fıstığı, soya, sert kabuklu, kereviz, hardal, susam, sülfit, acı bakla ve yumuşakçadır.

Bu alan güvenlik hard-filter’ında kullanılır ancak API her zaman `allergenDataStatus: "inferred"` döndürür. Ürün etiketi ve profesyonel görüşün yerini almaz.

## Burak veri teslimi

- Kaynak değiştiğinde yeni checksum ve bütün sayaçları bağımsız doğrulamak.
- Alias çakışmalarını ve canonical ingredient kapsamını raporlamak.
- Alerjen eşleme fixture’larını gözden geçirmek.
- Tam/kısmi maliyet kapsamındaki değişimi release notuna eklemek.
