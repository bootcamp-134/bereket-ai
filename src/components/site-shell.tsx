import Link from "next/link";
import type { ReactNode } from "react";

export function BrandMark() {
  return (
    <span className="grid size-9 place-items-center rounded-md border border-white/20 bg-white text-black">
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="size-5"
        fill="none"
      >
        <path
          d="M25.8 5.4C17.4 5.8 10.1 8.9 7 15.7c-1.7 3.7-.8 7.6 1.9 9.8 3.2-7.2 8.3-11.5 14.8-14.2-5.4 3.4-9.6 8.2-12.3 14.3 4.2.7 8.4-1.3 10.9-5.2 2.6-4 3.4-9.1 3.5-15Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-black text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-white/12 bg-black/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <BrandMark />
            <span>
              <span className="block text-sm font-medium text-white">
                Bereket AI
              </span>
              <span className="block text-xs text-neutral-600">Takım 134</span>
            </span>
          </Link>
          <nav aria-label="Ana navigasyon" className="flex items-center gap-1">
            <Link
              className="site-nav-link hidden sm:inline-flex"
              href="/status"
            >
              Sistem durumu
            </Link>
            <Link
              className="site-nav-link hidden md:inline-flex"
              href="/privacy"
            >
              Gizlilik
            </Link>
            <Link className="site-nav-cta" href="/sprint-1-demo">
              Sprint 1 demosu
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="border-t border-white/12 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-9 text-sm text-neutral-600 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>Google Yapay Zeka ve Teknoloji Akademisi · Bootcamp 2026</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="https://github.com/bootcamp-134/bereket-ai"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://api.bereket.app/api/docs"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              API dokümanı
            </a>
            <Link
              className="transition-colors hover:text-white"
              href="/privacy"
            >
              Gizlilik
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
