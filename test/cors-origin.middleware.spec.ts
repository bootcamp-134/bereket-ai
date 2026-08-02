import { describe, expect, it, vi } from "vitest";
import { createCorsOriginGuard } from "../src/common/cors-origin.middleware";

function responseHarness() {
  const headers = new Map<string, string>();
  const response = {
    setHeader: vi.fn((name: string, value: string) => headers.set(name, value)),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return { response, headers };
}

describe("CORS origin guard", () => {
  it("returns a controlled 403 envelope for a rejected origin", () => {
    process.env.NODE_ENV = "production";
    const { response, headers } = responseHarness();
    const request = {
      header: vi.fn().mockReturnValue("https://evil.example"),
      method: "GET",
      originalUrl: "/api/v1/health",
      requestId: "",
    };
    const next = vi.fn();
    const logger = { warn: vi.fn() };
    createCorsOriginGuard(new Set(["https://bereket.app"]), logger)(
      request as never,
      response as never,
      next,
    );
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        code: "FORBIDDEN",
        requestId: expect.stringMatching(/^req_/),
      }),
    });
    expect(headers.get("vary")).toBe("Origin");
    expect(logger.warn).toHaveBeenCalledOnce();
  });

  it("allows the product domain and local development origins", () => {
    const logger = { warn: vi.fn() };
    for (const [nodeEnv, origin] of [
      ["production", "https://bereket.app"],
      ["development", "http://localhost:3000"],
    ]) {
      process.env.NODE_ENV = nodeEnv;
      const { response } = responseHarness();
      const next = vi.fn();
      createCorsOriginGuard(new Set(["https://bereket.app"]), logger)(
        {
          header: vi.fn().mockReturnValue(origin),
          method: "GET",
          originalUrl: "/api/v1/health",
        } as never,
        response as never,
        next,
      );
      expect(next).toHaveBeenCalledOnce();
    }
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
