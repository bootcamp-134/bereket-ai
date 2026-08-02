import { z } from "zod";

const optionalSecret = z.string().trim().min(32).optional();

const environmentSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().trim().min(1).optional(),
    DATABASE_URL_UNPOOLED: z.string().trim().min(1).optional(),
    JWT_ACCESS_SECRET: optionalSecret,
    REFRESH_TOKEN_PEPPER: optionalSecret,
    PASSWORD_RESET_TOKEN_PEPPER: optionalSecret,
    OPENAI_SAFETY_PEPPER: optionalSecret,
    CRON_SECRET: optionalSecret,
    APP_BASE_URL: z.string().url().default("https://bereket.app"),
    API_BASE_URL: z.string().url().default("https://api.bereket.app/api/v1"),
    CORS_ORIGINS: z.string().optional(),
    CORS_ORIGIN: z.string().optional(),
    RESEND_API_KEY: z.string().trim().min(1).optional(),
    RESEND_FROM: z
      .string()
      .trim()
      .default("Bereket AI <noreply@mail.bereket.app>"),
    OPENAI_API_KEY: z.string().trim().min(1).optional(),
    OPENAI_MODEL: z.string().trim().default("gpt-5.4-mini-2026-03-17"),
    OPENAI_MONTHLY_BUDGET_USD: z.coerce.number().positive().max(100).default(5),
    SWAGGER_ENABLED: z.enum(["true", "false"]).default("true"),
  })
  .passthrough();

const productionRequired = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "JWT_ACCESS_SECRET",
  "REFRESH_TOKEN_PEPPER",
  "PASSWORD_RESET_TOKEN_PEPPER",
  "OPENAI_SAFETY_PEPPER",
  "CRON_SECRET",
  "RESEND_API_KEY",
  "OPENAI_API_KEY",
] as const;

export function validateEnvironment(raw: Record<string, unknown>) {
  const parsed = environmentSchema.safeParse(raw);
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.join("."))),
    ].filter(Boolean);
    throw new Error(
      `Environment yapılandırması geçersiz: ${fields.join(", ")}`,
    );
  }

  const environment = parsed.data;
  if (environment.NODE_ENV === "production") {
    const missing = productionRequired.filter((name) => !environment[name]);
    if (missing.length) {
      throw new Error(
        `Eksik production environment değişkenleri: ${missing.join(", ")}`,
      );
    }

    const independentSecrets = [
      environment.JWT_ACCESS_SECRET,
      environment.REFRESH_TOKEN_PEPPER,
      environment.PASSWORD_RESET_TOKEN_PEPPER,
      environment.OPENAI_SAFETY_PEPPER,
      environment.CRON_SECRET,
    ];
    if (new Set(independentSecrets).size !== independentSecrets.length) {
      throw new Error(
        "Production secret değerleri birbirinden bağımsız olmalıdır.",
      );
    }
    if (!environment.APP_BASE_URL.startsWith("https://")) {
      throw new Error("APP_BASE_URL production ortamında HTTPS olmalıdır.");
    }
    if (!environment.API_BASE_URL.startsWith("https://")) {
      throw new Error("API_BASE_URL production ortamında HTTPS olmalıdır.");
    }
  }

  return environment;
}
