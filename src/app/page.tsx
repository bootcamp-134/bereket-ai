import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const metrics = [
  ["3.005", "benzersiz tarif"],
  ["27.382", "malzeme satırı"],
  ["21.331", "fiyatlandırılmış satır"],
  ["30+", "Türkçe test senaryosu"],
] as const;

const productionCapabilities = [
  ["Flutter istemci", "Canlı API, güvenli oturum ve gerçek tarif verisi"],
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
    period: "Canlı ürün",
    title: "Uçtan uca tamamladık",
    body: "Gerçek tarif verisini, production servislerini ve Flutter istemciyi güvenli oturum, öneri ve tarife özel sohbet akışlarında bir araya getirdik.",
    status: "Tamamlandı",
  },
] as const;

const mobileScreens = [
  {
    src: "/mobile/profile-ready.png",
    width: 381,
    height: 843,
    title: "Kişiselleştirilmiş profil",
    description: "Hane, bütçe, beslenme tercihi ve alerjen bilgileri.",
    alt: "Bereket AI tamamlanmış profil ve tercihler ekranı",
  },
  {
    src: "/mobile/ingredients-start.png",
    width: 376,
    height: 817,
    title: "Malzeme girişi",
    description: "En fazla 20 malzeme ve alışveriş tercihiyle öneri başlatma.",
    alt: "Bereket AI Ne Yesem malzeme giriş ekranı",
  },
  {
    src: "/mobile/ingredients-budget.png",
    width: 394,
    height: 830,
    title: "Bütçe ve alışveriş",
    description: "Eksik malzemeler için alışveriş izni ve bütçe sınırı.",
    alt: "Bereket AI seçili malzemeler ve alışveriş bütçesi ekranı",
  },
  {
    src: "/mobile/recommendations.png",
    width: 362,
    height: 821,
    title: "Güvenli öneriler",
    description: "Eşleşme oranı, eksikler ve tahminî maliyet açıklamaları.",
    alt: "Bereket AI kişiselleştirilmiş tarif önerileri ekranı",
  },
  {
    src: "/mobile/recipe-detail.png",
    width: 387,
    height: 838,
    title: "Gerçek tarif detayı",
    description: "Malzemeler, hazırlanış adımları, süre ve maliyet bilgisi.",
    alt: "Bereket AI tarif detay ekranı",
  },
  {
    src: "/mobile/recipe-assistant.png",
    width: 393,
    height: 847,
    title: "Tarife özel asistan",
    description: "Seçilen tarif bağlamında kalan ve geçmişi koruyan sohbet.",
    alt: "Bereket AI tarife özel sohbet asistanı ekranı",
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
            Backend, öneri sistemi ve Flutter istemci birlikte çalışıyor.
          </h2>
          <p className="section-copy max-w-xl">
            Sprint 3 ile mock veriden gerçek tarif verisine geçildi. Flutter
            uygulaması; hesap, profil, tarif kataloğu, kişiselleştirilmiş öneri
            ve tarife özel sohbet akışlarında production API'ye bağlandı.
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

      <section className="border-y border-white/12 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="section-kicker">Flutter uygulaması</p>
            </div>
            <div className="lg:col-span-8">
              <h2 className="section-title mt-0">
                Canlı veriden kişisel tarife.
              </h2>
              <p className="section-copy max-w-2xl">
                Mobil istemci gerçek API sözleşmesini kullanır; güvenli oturum,
                nullable maliyetler, tarif kataloğu, öneriler ve kalıcı tarif
                sohbeti tek kullanıcı akışında birleşir.
              </p>
            </div>
          </div>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {mobileScreens.map((screen) => (
              <figure key={screen.src}>
                <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-[#fbf6ee] shadow-2xl shadow-black/30">
                  <Image
                    src={screen.src}
                    width={screen.width}
                    height={screen.height}
                    alt={screen.alt}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-5">
                  <p className="font-medium text-white">{screen.title}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {screen.description}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
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
              Canlı servisler ve mobil entegrasyon hazır; ürün jüri demosuna
              hazır.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-md text-sm leading-7 text-neutral-600">
              Flutter uygulaması production API ile uçtan uca çalışıyor. Mağaza
              imzalama, fiziksel cihaz doğrulaması ve yayın operasyonları ürün
              geliştirmesinden ayrı teslim adımları olarak izleniyor.
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
