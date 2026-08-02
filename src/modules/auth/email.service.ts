import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Resend } from "resend";
import { RESEND_CLIENT } from "./resend.provider";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@Inject(RESEND_CLIENT) private readonly resend: Resend | null) {}

  async sendPasswordReset(input: {
    email: string;
    fullName?: string | null;
    token: string;
    tokenId: string;
  }) {
    if (!this.resend) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("RESEND_API_KEY tanımlı değil.");
      }
      this.logger.warn(
        "RESEND_API_KEY yok; geliştirme ortamında e-posta atlandı.",
      );
      return;
    }

    const appBaseUrl = process.env.APP_BASE_URL ?? "https://bereket.app";
    const from =
      process.env.RESEND_FROM ?? "Bereket AI <noreply@mail.bereket.app>";
    const resetUrl = `${appBaseUrl}/reset-password#token=${encodeURIComponent(input.token)}`;
    const name = escapeHtml(input.fullName?.trim() || "Bereket AI kullanıcısı");
    const { error } = await this.resend.emails.send(
      {
        from,
        to: input.email,
        subject: "Bereket AI şifreni yenile",
        text: `Merhaba ${input.fullName?.trim() || ""}, şifreni yenilemek için 30 dakika içinde şu bağlantıyı aç: ${resetUrl}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#19352a"><h1>Şifreni yenile</h1><p>Merhaba ${name},</p><p>Bereket AI hesabın için şifre yenileme isteği aldık. Bağlantı 30 dakika geçerlidir.</p><p><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#2f6b4f;color:white;padding:12px 18px;border-radius:8px;text-decoration:none">Yeni şifre belirle</a></p><p>Bu isteği sen yapmadıysan e-postayı yok sayabilirsin.</p></div>`,
      },
      { idempotencyKey: `password-reset/${input.tokenId}` },
    );

    if (error) throw new Error(`Resend gönderimi başarısız: ${error.name}`);
  }
}
