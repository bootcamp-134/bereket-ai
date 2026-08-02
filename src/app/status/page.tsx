import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Sistem Durumu",
  description: "Bereket AI canlı servis ve tarif verisi durumu.",
};

type HealthData = {
  name: string;
  status: string;
  version: string;
  database: string;
  dataset:
    | {
        status: "ready";
        checksum: string;
        recipeCount: number;
        importedAt: string;
      }
    | { status: "not_imported" };
  timestamp: string;
};

async function getProductionHealth(): Promise<HealthData | null> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("production-health");
  const apiBaseUrl =
    process.env.API_BASE_URL ?? "https://api.bereket.app/api/v1";
  try {
    const response = await fetch(`${apiBaseUrl}/health`);
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: HealthData };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export default async function StatusPage() {
  const health = await getProductionHealth();
  const ready = health?.status === "ok" && health.dataset.status === "ready";

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="section-kicker">Canlı sistem</p>
        <div className="mt-6 flex flex-col gap-7 border-b border-white/8 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
              Sistem durumu
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
              Backend servisinin ve tarif verisinin güncel durumunu gösterir.
              Bilgi dakikada bir yenilenir.
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
              ready
                ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                : "border-amber-200/20 bg-amber-100/10 text-amber-100"
            }`}
          >
            <span
              className={`size-2 rounded-full ${ready ? "bg-emerald-300" : "bg-amber-200"}`}
            />
            {ready ? "Servisler hazır" : "Canlı durum alınamıyor"}
          </span>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            ["API", health?.status ?? "ulaşılamıyor"],
            ["Veritabanı", health?.database ?? "ulaşılamıyor"],
            ["Tarif verisi", health?.dataset.status ?? "ulaşılamıyor"],
            ["Sürüm", health?.version ?? "ulaşılamıyor"],
          ].map(([label, value]) => (
            <div
              className="rounded-2xl border border-white/8 bg-white/[0.025] p-6"
              key={label}
            >
              <p className="text-sm text-stone-500">{label}</p>
              <p className="mt-3 font-mono text-lg text-stone-100">{value}</p>
            </div>
          ))}
        </div>

        {health?.dataset.status === "ready" ? (
          <section className="mt-10 rounded-[2rem] border border-white/8 bg-black/15 p-7 sm:p-9">
            <h2 className="text-2xl font-medium tracking-tight text-white">
              Tarif verisi
            </h2>
            <dl className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-stone-500">Tarif sayısı</dt>
                <dd className="mt-2 text-3xl font-semibold text-emerald-200">
                  {health.dataset.recipeCount.toLocaleString("tr-TR")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Veri sürümü</dt>
                <dd className="mt-2 break-all font-mono text-xs leading-6 text-stone-300">
                  {health.dataset.checksum}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            className="primary-link"
            href="https://api.bereket.app/api/docs"
            target="_blank"
            rel="noreferrer"
          >
            API dokümanını aç <span aria-hidden="true">↗</span>
          </a>
          <a
            className="secondary-link"
            href="https://github.com/bootcamp-134/bereket-ai/tree/backend"
            target="_blank"
            rel="noreferrer"
          >
            Backend kodu
          </a>
        </div>
      </div>
    </SiteShell>
  );
}
