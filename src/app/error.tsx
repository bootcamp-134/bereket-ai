"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-[#07130f] px-5 text-center text-stone-100">
      <div className="max-w-lg">
        <p className="font-mono text-sm text-amber-200">BEKLENMEYEN HATA</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">
          Sayfa şu anda hazırlanamadı.
        </h1>
        <p className="mt-4 leading-7 text-stone-400">
          Kişisel veri göstermeden güvenli hata sınırına geçildi. İsteği yeniden
          deneyebilirsiniz.
        </p>
        <button
          className="primary-link mt-8"
          type="button"
          onClick={() => reset()}
        >
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
