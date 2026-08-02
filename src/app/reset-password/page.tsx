import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Şifre Yenile",
  description: "Bereket AI hesabınız için güvenli yeni şifre belirleyin.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  const apiBaseUrl =
    process.env.API_BASE_URL ?? "https://api.bereket.app/api/v1";
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="section-kicker">Hesap güvenliği</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Yeni şifre belirleyin
        </h1>
        <p className="mt-5 leading-7 text-stone-400">
          E-postadaki bağlantı 30 dakika geçerlidir ve yalnız bir kez
          kullanılabilir. İşlem tamamlandığında tüm açık refresh oturumları
          kapatılır.
        </p>
        <ResetPasswordForm apiBaseUrl={apiBaseUrl} />
      </div>
    </SiteShell>
  );
}
