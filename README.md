# BereketAgent

> **Tarihsel prototip uyarısı:** Bu branch Gemini + RecipeNLG ile hazırlanmış deneysel Python agent çalışmasını korur; Bereket AI production runtime'ı değildir. Canlı tarif önerisi ve recipe chat agent'ı `backend` branch'inde NestJS, Neon ve OpenAI Responses API ile çalışır. Branch geçmişleri topluca merge edilmemelidir.

## Production'a geçiş notu — 2 Ağustos 2026

- Canlı API: `https://api.bereket.app/api/v1`
- Production model: `gpt-5.4-mini-2026-03-17`
- Production dataset: 3.005 tarif, 27.382 malzeme satırı; SHA-256 `63c0fdf21fe854477d31aa803de9be61e901a6b6ed37609217db9b71b3278c9b`
- Akış: Neon sorgusu → deterministic scoring → alerjen/bütçe hard-filter → en fazla 15 aday → OpenAI structured-output rerank → recipe ID doğrulaması → en fazla 5 sonuç.
- Timeout, 429, geçersiz çıktı ve aylık 5 USD uygulama limitinde deterministic fallback kullanılır.

Bu branch araştırma ve tarihsel karşılaştırma için saklanır. Yeni production agent değişiklikleri burada değil `backend` branch'inde yapılmalıdır.

Bereket AI projesinin **agent katmanı** — kullanıcının kilerindeki malzemelere göre güvenli, kişiselleştirilmiş yemek tarifi önerileri üreten agent zinciri.

Bu repo, Bereket AI ekibindeki **AI Engineer** rolünün sorumluluğunda geliştirilen kısmı içerir: Pantry Parser Agent, Recipe Match Agent ve alerji/kısıtlama güvenlik filtresi.

## Bu ne yapıyor

Kullanıcı serbest metinle (Türkçe veya İngilizce) evindeki malzemeleri ve varsa alerji/kısıtlamalarını yazıyor. Sistem bunu işleyip, 2.2 milyondan fazla tarif içeren bir veri setinden (RecipeNLG) güvenli ve uygun tarif önerileri çıkarıyor.

```
Serbest metin girdisi
        │
        ▼
Pantry Parser Agent (Gemini) — malzemeleri yapılandırılmış, İngilizce listeye çevirir
        │
        ▼
Recipe Match — normalize edilmiş indeks üzerinden aday tarifleri bulur ve skorlar
        │
        ▼
Güvenlik filtresi — alerji/kısıtlamaları HAM METİN üzerinde tam tarama ile eler
        (skorla değil, kesin filtreyle — hiçbir varyant kaçmaz)
        │
        ▼
Güvenli, sıralı tarif önerileri
```

## Proje yapısı

```
BereketAgent/
├── .env.example              # Örnek ortam değişkeni dosyası
├── requirements.txt
├── data/
│   ├── raw/                  # dataset.zip buraya konur (repo'da yok, .gitignore'da)
│   └── processed/            # İşlenmiş parquet + indeks (repo'da yok, script ile üretilir)
├── src/
│   ├── config.py              # Ayarlar, .env okuma, dosya yolları
│   ├── data_processing.py     # Ham veriyi temizleme, etiketleme, indeks kurma
│   ├── recipe_matcher.py       # Recipe Match Agent
│   ├── safety_filter.py        # Alerji/kısıtlama hard-filter (güvenlik katmanı)
│   ├── pantry_parser_agent.py  # Pantry Parser Agent (Gemini API)
│   └── pipeline.py             # Uçtan uca orkestrasyon
├── scripts/
│   └── build_dataset.py        # Veriyi bir kere işleyip diske kaydeden script
└── main.py                     # Demo / hızlı test çalıştırma dosyası
```

## Kurulum

1. Sanal ortam oluştur ve aktive et:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\Activate.ps1
   # macOS/Linux:
   source venv/bin/activate
   ```

2. Bağımlılıkları kur:
   ```bash
   pip install -r requirements.txt
   ```

3. `.env.example` dosyasını `.env` olarak kopyala, içine kendi Gemini API key'ini yaz:
   ```
   GEMINI_API_KEY=senin_keyin
   ```
   Key'i ücretsiz olarak [aistudio.google.com](https://aistudio.google.com) üzerinden alabilirsin.

4. Tarif veri setini (`dataset.zip`, RecipeNLG formatında) `data/raw/dataset.zip` konumuna koy.

5. Veriyi işle (tek seferlik, birkaç dakika sürer):
   ```bash
   python scripts/build_dataset.py
   ```

6. Test et:
   ```bash
   python main.py
   ```

## Güvenlik tasarımı — önemli bir not

Alerji/kısıtlama filtresi **kural tabanlıdır, LLM'e sorulmaz** ve normalize edilmiş arama indeksini **kullanmaz** — her aday tarif, ham malzeme metni üzerinde tam substring taraması ile kontrol edilir. Bu, "green onion" gibi varyantların "onion" kısıtlamasından kaçmasını önlemek için bilinçli bir tasarım kararıdır: arama hızlı ve esnek olabilir, ama güvenlik kontrolü her zaman kesin ve yavaş-ama-güvenilir olmalıdır.

## Şu anki durum ve bilinen sınırlamalar

- Diyet etiketleme (vejetaryen/sütsüz/glutensiz) basit anahtar kelime eşleşmesiyle yapılıyor, kapsamlı bir alerjen sözlüğü henüz yok.
- Malzeme normalizasyonu (tekil/çoğul, eşanlamlılar) temel düzeyde; "green onion" ile "onion" gibi çok kelimeli varyantlar arama tarafında hâlâ ayrı sayılabiliyor (güvenlik filtresi bundan etkilenmiyor, sadece arama kapsamını daraltıyor).
- Fiyat/bütçe bilgisi ve porsiyon/kişi sayısı veri setinde yok, Budget Optimizer Agent için ayrıca eklenmesi gerekiyor.

## Devamı geliyor

Bu repo aktif geliştirme aşamasında. Sırada:

- **Budget Optimizer Agent** — OR-Tools ile bütçe ve israf optimizasyonu
- **Waste Coach Agent** — bozulma riski etiketleme
- **Shopping Agent** — eksik malzeme listesi ve fiyat tahmini
- **Explanation Agent** — kullanıcıya sade Türkçe açıklama üretimi
- Kategori bazlı kısıtlamaların (vejetaryen, glutensiz vb.) onboarding formundan gelen yapıyla tam entegrasyonu
- Full-Stack ekibiyle API endpoint entegrasyonu

Sorular veya katkılar için issue açabilirsiniz.
