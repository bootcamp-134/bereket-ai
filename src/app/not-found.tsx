import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8 sm:py-36">
        <p className="font-mono text-sm text-emerald-300">404</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">
          Bu sayfa mutfakta değil.
        </h1>
        <p className="mt-5 text-stone-400">
          Aradığınız adres taşınmış veya hiç oluşturulmamış olabilir.
        </p>
        <Link className="primary-link mt-8" href="/">
          Ana sayfaya dön
        </Link>
      </div>
    </SiteShell>
  );
}
