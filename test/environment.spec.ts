import { describe, expect, it } from "vitest";
import { validateEnvironment } from "../src/config/environment";

const productionEnvironment = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://runtime.example/bereket",
  DATABASE_URL_UNPOOLED: "postgresql://direct.example/bereket",
  JWT_ACCESS_SECRET: "jwt-access-secret-at-least-32-characters",
  REFRESH_TOKEN_PEPPER: "refresh-pepper-at-least-32-characters",
  PASSWORD_RESET_TOKEN_PEPPER: "reset-pepper-at-least-32-characters--",
  OPENAI_SAFETY_PEPPER: "openai-safety-at-least-32-characters--",
  CRON_SECRET: "cron-secret-at-least-32-characters-long",
  RESEND_API_KEY: "re_test",
  OPENAI_API_KEY: "sk-test",
  APP_BASE_URL: "https://bereket.app",
  API_BASE_URL: "https://api.bereket.app/api/v1",
};

describe("production environment validation", () => {
  it("accepts complete production configuration", () => {
    expect(validateEnvironment(productionEnvironment)).toMatchObject({
      NODE_ENV: "production",
      OPENAI_MONTHLY_BUDGET_USD: 5,
    });
  });

  it("rejects missing and shared production secrets without exposing values", () => {
    expect(() =>
      validateEnvironment({
        ...productionEnvironment,
        OPENAI_API_KEY: undefined,
      }),
    ).toThrow("OPENAI_API_KEY");
    expect(() =>
      validateEnvironment({
        ...productionEnvironment,
        CRON_SECRET: productionEnvironment.JWT_ACCESS_SECRET,
      }),
    ).toThrow("birbirinden bağımsız");
  });

  it("requires HTTPS product URLs in production", () => {
    expect(() =>
      validateEnvironment({
        ...productionEnvironment,
        APP_BASE_URL: "http://bereket.app",
      }),
    ).toThrow("HTTPS");
  });
});
