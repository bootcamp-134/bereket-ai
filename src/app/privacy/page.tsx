import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Gizlilik",
  description: "Bereket AI gizlilik ve veri işleme özeti.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <article className="prose-page">
        <p className="section-kicker">Son güncelleme · 2 Ağustos 2026</p>
        <h1>Gizlilik özeti</h1>
        <p>
          Bereket AI, tarif önerisi sunmak için hesap, profil, bütçe tercihi,
          kullanıcının belirttiği alerjenler ve tarif sohbeti verilerini işler.
          Parolalar hiçbir zaman düz metin saklanmaz; Argon2id ile hash’lenir.
        </p>
        <h2>Agent’a aktarılan veri</h2>
        <p>
          OpenAI’ye parola, token, e-posta veya kullanıcı entity’si gönderilmez.
          Öneri çağrısında yalnız güvenli aday tarifler ve istek bağlamı; tarif
          sohbetinde yalnız seçili tarif ile son 10 mesaj kullanılır. Ham
          kullanıcı kimliği yerine tek yönlü HMAC safety identifier gönderilir.
        </p>
        <h2>Saklama ve güvenlik</h2>
        <p>
          Kullanıcı ve tarif verileri Neon PostgreSQL’de tutulur. Refresh ve
          reset tokenları hash’li saklanır; süreleri dolan operasyonel kayıtlar
          günlük bakım işiyle temizlenir. Sağlayıcı secret’ları yalnız Vercel
          environment değişkenlerindedir.
        </p>
        <h2>Önemli sınırlar</h2>
        <p>
          Alerjen verisi malzeme adlarından muhafazakâr biçimde çıkarılır ve
          <code>inferred</code> olarak işaretlenir. Ürün etiketi, hekim veya
          diyetisyen görüşünün yerini almaz. Maliyetler tahminîdir; eksik
          fiyatlar sıfır kabul edilmez.
        </p>
        <h2>İletişim</h2>
        <p>
          Bu bootcamp release’iyle ilgili teknik ve veri talepleri GitHub
          repository üzerinden Takım 134’e iletilebilir.
        </p>
      </article>
    </SiteShell>
  );
}
