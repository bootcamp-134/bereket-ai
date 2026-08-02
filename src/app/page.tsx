import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const metrics = [
  ["3.005", "benzersiz tarif"],
  ["27.382", "malzeme satırı"],
  ["21.331", "fiyatlandırılmış satır"],
  ["30+", "Türkçe test senaryosu"],
] as const;

const productionCapabilities = [
  ["Canlı API", "Kayıt, profil, tarif ve sohbet akışları"],
  ["Tarif verisi", "3.005 tarif, nullable ve tahminî maliyetler"],
  ["Öneri sistemi", "Malzeme, bütçe ve alerjen kısıtları"],
  ["Tarif sohbeti", "Seçilen tarif bağlamıyla sınırlı destek"],
] as const;

const sprints = [
  {
    number: "01",
    period: "Web prototipi",
    title: "Fikri görünür kıldık",
    body: "Hazır sorular ve statik yemek planıyla ürün fikrini hızlıca deneyimlenebilir hâle getirdik.",
    status: "Tamamlandı",
  },
  {
    number: "02",
    period: "Flutter ve mock API",
    title: "Mobil akışı kurduk",
    body: "Onboarding, profil, bütçe ve tarif akışlarını mobil uygulama ile mock backend üzerinde modelledik.",
    status: "Tamamlandı",
  },
  {
    number: "03",
    period: "Gerçek veri ve servisler",
    title: "Canlı sisteme geçtik",
    body: "Tarif verisini, kullanıcı işlemlerini, önerileri ve tarife özel sohbeti production backend'de bir araya getirdik.",
    status: "Backend hazır",
  },
] as const;

const process = [
  ["01", "Bilgileri al", "Malzemeler, bütçe ve yemek tercihleri"],
  ["02", "Tarifleri eşleştir", "Katalogda hazırlanabilir seçenekler"],
  ["03", "Kısıtları uygula", "Bütçe ve alerjen kontrolü"],
  ["04", "Sonucu açıkla", "En fazla beş öneri ve tarif sohbeti"],
] as const;

const team = [
  ["Sıla Karataş", "Product Owner"],
  ["Burak Başoda", "Scrum Master · Data"],
  ["Ceren Karabağ", "Agent kalite"],
  ["Anıl Dinç", "Flutter"],
  ["Samet Dönmez", "Backend · Platform"],
] as const;

export default function HomePage() {
  return (
    <SiteShell>
      <section className="border-b border-white/12">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8 lg:py-36">
          <div className="lg:col-span-8">
            <p className="text-sm text-neutral-500">
              Google Yapay Zeka ve Teknoloji Akademisi · Takım 134
            </p>
            <h1 className="mt-8 max-w-5xl text-balance text-6xl leading-[0.92] font-semibold tracking-[-0.065em] text-white sm:text-8xl lg:text-[7.5rem]">
              Evde ne varsa,
              <span className="block text-neutral-500">onunla başla.</span>
            </h1>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-pretty text-lg leading-8 text-neutral-400">
              Bereket AI, mutfaktaki malzemeleri, bütçeyi ve tercihleri birlikte
              değerlendirerek uygun tarifleri bulmayı kolaylaştırır.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-link" href="/status">
                Canlı sistemi incele
              </Link>
              <Link className="secondary-link" href="/sprint-1-demo">
                Sprint 1 demosu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Veri seti özeti"
        className="border-b border-white/12"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {metrics.map(([value, label], index) => (
            <div
              className={`py-7 sm:py-9 ${index % 2 === 1 ? "border-l border-white/12 pl-5 sm:pl-8" : "pr-5 sm:pr-8"} ${index > 1 ? "border-t border-white/12 lg:border-t-0" : ""} ${index > 0 ? "lg:border-l lg:border-white/12 lg:pl-8" : ""}`}
              key={label}
            >
              <p className="text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
                {value}
              </p>
              <p className="mt-2 text-sm text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="section-kicker">Ürün bugün nerede?</p>
          <h2 className="section-title max-w-3xl">
            Backend ve öneri sistemi canlı. Mobil bağlantı son adım.
          </h2>
          <p className="section-copy max-w-xl">
            Sprint 3 ile mock veriden gerçek tarif verisine geçildi. Servisler
            production ortamında çalışıyor; Flutter uygulamasının bu akışlara
            bağlanması mobil ekip tarafından tamamlanacak.
          </p>
        </div>
        <dl className="border-t border-white/16 lg:col-span-5">
          {productionCapabilities.map(([term, description]) => (
            <div
              className="grid gap-2 border-b border-white/12 py-5 sm:grid-cols-[9rem_1fr]"
              key={term}
            >
              <dt className="text-sm font-medium text-white">{term}</dt>
              <dd className="text-sm leading-6 text-neutral-500">
                {description}
              </dd>
            </div>
          ))}
          <div className="pt-6">
            <a
              className="text-link"
              href="https://api.bereket.app/api/docs"
              target="_blank"
              rel="noreferrer"
            >
              API dokümanını aç <span aria-hidden="true">↗</span>
            </a>
          </div>
        </dl>
      </section>

      <section className="border-y border-white/12">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="section-kicker">Üç sprintlik gelişim</p>
            </div>
            <h2 className="section-title mt-0 lg:col-span-8">
              Fikirden çalışan ürüne.
            </h2>
          </div>
          <div className="mt-14 border-t border-white/16">
            {sprints.map((sprint) => (
              <article
                className="grid gap-4 border-b border-white/12 py-7 sm:grid-cols-12 sm:gap-6 sm:py-9"
                key={sprint.number}
              >
                <p className="font-mono text-sm text-neutral-600 sm:col-span-1">
                  {sprint.number}
                </p>
                <div className="sm:col-span-3">
                  <p className="text-sm text-neutral-500">{sprint.period}</p>
                  <p className="mt-1 text-sm text-neutral-300">
                    {sprint.status}
                  </p>
                </div>
                <h3 className="text-xl font-medium tracking-[-0.025em] text-white sm:col-span-3">
                  {sprint.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-neutral-500 sm:col-span-5">
                  {sprint.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="section-kicker">Nasıl çalışır?</p>
            <h2 className="section-title">Karardan tarife, dört adım.</h2>
          </div>
          <ol className="grid border-t border-white/16 sm:grid-cols-2 lg:col-span-8">
            {process.map(([number, title, description], index) => (
              <li
                className={`border-b border-white/12 py-7 sm:p-7 ${index % 2 === 1 ? "sm:border-l" : ""}`}
                key={number}
              >
                <p className="font-mono text-xs text-neutral-600">{number}</p>
                <h3 className="mt-8 font-medium text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/12">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="section-kicker">Takım 134</p>
            <h2 className="section-title max-w-md">
              Farklı uzmanlıklar, tek ürün.
            </h2>
          </div>
          <dl className="border-t border-white/16 lg:col-span-7">
            {team.map(([name, role]) => (
              <div
                className="flex items-center justify-between gap-8 border-b border-white/12 py-4"
                key={name}
              >
                <dt className="text-sm font-medium text-neutral-200">{name}</dt>
                <dd className="text-right text-sm text-neutral-500">{role}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <p className="text-sm text-neutral-500">Jüri için güncel durum</p>
            <h2 className="mt-5 max-w-4xl text-balance text-4xl leading-[1.03] font-semibold tracking-[-0.05em] sm:text-6xl">
              Canlı servisler hazır; ürünün tamamlanması için mobil entegrasyon
              bekleniyor.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-md text-sm leading-7 text-neutral-600">
              Backend, gerçek tarif verisi ve öneri sistemi production ortamında
              çalışıyor. Güncel doğrulama sonuçları sistem durumu sayfasında yer
              alıyor.
            </p>
            <Link className="light-section-link mt-7" href="/status">
              Sistem durumunu gör <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
