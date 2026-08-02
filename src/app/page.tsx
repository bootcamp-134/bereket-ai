import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const sprints = [
  {
    number: "01",
    title: "Fikri görünür kıldık",
    period: "Web prototipi",
    body: "ChatGPT benzeri deneyim, hazır sorular ve statik yemek planıyla ürün hipotezini hızlıca test ettik.",
    status: "Tamamlandı",
  },
  {
    number: "02",
    title: "Mobil akışı kurduk",
    period: "Flutter + mock API",
    body: "Onboarding, profil, bütçe, tarif önerisi ve detay akışlarını mobil uygulama ve NestJS mock endpointleriyle modelledik.",
    status: "Tamamlandı",
  },
  {
    number: "03",
    title: "Canlı sisteme geçtik",
    period: "Gerçek veri + çalışan servisler",
    body: "Tarif verisini, hesap işlemlerini, öneri akışını ve tarife özel sohbeti canlı backend üzerinde bir araya getirdik.",
    status: "Backend hazır",
  },
] as const;

const metrics = [
  ["3.005", "benzersiz tarif"],
  ["27.382", "malzeme satırı"],
  ["21.331", "fiyatlandırılmış satır"],
  ["30+", "Türkçe test senaryosu"],
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
      <section className="relative isolate overflow-hidden border-b border-white/8">
        <div className="hero-grid absolute inset-0 -z-20" />
        <div className="absolute -top-48 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-36">
          <div>
            <p className="section-kicker">
              Google Yapay Zeka ve Teknoloji Akademisi · Takım 134
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl leading-[0.98] font-semibold tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.6rem]">
              Mutfağındakiyle
              <span className="block text-emerald-300">
                daha akıllı planla.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-stone-400 sm:text-xl">
              Evdeki malzemeleri, bütçeyi ve yemek tercihlerini birlikte
              değerlendirir; ne pişireceğine karar vermeyi kolaylaştırır.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link className="primary-link" href="/status">
                Canlı sistemi incele
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="secondary-link" href="/sprint-1-demo">
                İlk prototipi deneyimle
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200/15 bg-emerald-100/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">
                  Sprint 3
                </p>
                <p className="mt-2 text-xl font-medium text-white">
                  Backend ve öneri sistemi hazır
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
                Canlı
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ["Tarif kataloğu", "3.005 tarif"],
                ["Öneri", "Malzeme · bütçe · alerjen"],
                ["Tarif desteği", "Tarife özel sohbet"],
                ["Canlı servis", "API kullanıma hazır"],
              ].map(([label, value]) => (
                <div
                  className="flex items-center justify-between gap-6 rounded-2xl border border-white/7 bg-black/15 px-4 py-3.5"
                  key={label}
                >
                  <span className="text-sm text-stone-500">{label}</span>
                  <span className="text-right text-sm font-medium text-stone-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="https://api.bereket.app/api/docs"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100"
            >
              API dokümanını aç <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/8 bg-black/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
          {metrics.map(([value, label]) => (
            <div
              className="border-white/8 px-3 py-8 even:border-l lg:border-l lg:first:border-l-0"
              key={label}
            >
              <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {value}
              </p>
              <p className="mt-2 text-sm text-stone-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-3xl">
          <p className="section-kicker">Üç sprintlik gelişim</p>
          <h2 className="section-title">Fikirden çalışan ürüne, adım adım.</h2>
          <p className="section-copy">
            Her sprintte bir önceki çıktıyı koruyup bir sonraki ihtiyacı ele
            aldık. Böylece ürünün nasıl geliştiği hem demoda hem GitHub
            geçmişinde açıkça görülebiliyor.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {sprints.map((sprint) => (
            <article className="sprint-card" key={sprint.number}>
              <div className="flex items-start justify-between gap-5">
                <span className="font-mono text-4xl font-medium text-emerald-300/75">
                  {sprint.number}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">
                  {sprint.status}
                </span>
              </div>
              <p className="mt-10 text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">
                {sprint.period}
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-white">
                {sprint.title}
              </h3>
              <p className="mt-4 leading-7 text-stone-400">{sprint.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#091a14]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="section-kicker">Nasıl çalışır?</p>
              <h2 className="section-title">
                Kullanıcı bilgisinden uygun tarife.
              </h2>
              <p className="section-copy">
                Sistem önce kullanıcının malzemelerini ve tercihlerini tarif
                verisiyle karşılaştırır. Uygun seçenekleri bütçe ve alerjen
                bilgisine göre daraltır, ardından en anlamlı tarifleri kısa bir
                açıklamayla sunar.
              </p>
            </div>
            <ol className="space-y-3">
              {[
                [
                  "01",
                  "Bilgileri al",
                  "Evdeki malzemeler, bütçe ve yemek tercihleri",
                ],
                [
                  "02",
                  "Uygun tarifleri bul",
                  "Tarif kataloğunda malzeme eşleşmesi",
                ],
                [
                  "03",
                  "Kısıtları uygula",
                  "Bütçe ve alerjen bilgisine göre güvenli seçim",
                ],
                [
                  "04",
                  "Sonuçları açıkla",
                  "En fazla 5 tarif ve seçilen tarife özel sohbet",
                ],
              ].map(([number, title, description]) => (
                <li
                  className="grid grid-cols-[3rem_1fr] gap-4 rounded-2xl border border-white/8 bg-black/15 p-5"
                  key={number}
                >
                  <span className="font-mono text-sm text-emerald-300">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-medium text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-500">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="section-kicker">Takım 134</p>
            <h2 className="section-title">
              Farklı uzmanlıklar, ortak bir ürün.
            </h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {team.map(([name, role]) => (
                <div
                  className="rounded-2xl border border-white/8 bg-white/[0.025] px-5 py-4"
                  key={name}
                >
                  <p className="font-medium text-stone-100">{name}</p>
                  <p className="mt-1 text-sm text-stone-500">{role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-amber-200/15 bg-amber-100/[0.045] p-7 sm:p-9">
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-200/70 uppercase">
              Jüri notu
            </p>
            <h3 className="mt-4 text-2xl font-medium tracking-tight text-white">
              Canlı servisler hazır; son adım mobil bağlantı.
            </h3>
            <p className="mt-4 leading-7 text-stone-400">
              Backend, gerçek tarif verisi ve öneri sistemi production ortamında
              çalışıyor. Flutter uygulamasının canlı API'ye bağlanması mobil
              ekip tarafından tamamlanacak.
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-amber-100 hover:text-white"
              href="/status"
            >
              Canlı sistem durumunu gör <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
