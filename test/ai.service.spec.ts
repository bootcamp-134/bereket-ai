import { describe, expect, it, vi } from "vitest";
import { AiService } from "../src/modules/ai/ai.service";

function createHarness(options?: {
  parsed?: unknown;
  budgetAvailable?: boolean;
  clientEnabled?: boolean;
}) {
  process.env.OPENAI_SAFETY_PEPPER =
    "test-openai-safety-pepper-at-least-32-chars";
  process.env.OPENAI_MONTHLY_BUDGET_USD = "5";
  const parse = vi.fn().mockResolvedValue({
    id: "resp_test",
    output_parsed: options?.parsed ?? {
      results: [{ recipeId: "rec_1", reason: "Uygun tarif." }],
    },
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 10 },
      output_tokens: 20,
    },
  });
  const prisma = {
    $executeRaw: vi.fn().mockResolvedValue(1),
    $queryRaw: vi
      .fn()
      .mockResolvedValue(
        options?.budgetAvailable === false
          ? []
          : [{ periodStart: new Date("2026-08-01T00:00:00.000Z") }],
      ),
    $transaction: vi.fn(async (operations: Array<Promise<unknown>>) =>
      Promise.all(operations),
    ),
    aiUsage: {
      create: vi.fn().mockResolvedValue({ id: "usage_1" }),
    },
    aiBudgetPeriod: {
      update: vi.fn().mockResolvedValue({}),
    },
  };
  const client =
    options?.clientEnabled === false
      ? null
      : ({ responses: { parse } } as never);
  return {
    service: new AiService(prisma as never, client),
    prisma,
    parse,
  };
}

const candidates = [
  {
    id: "rec_1",
    title: "Mercimek Çorbası",
    category: "Çorba",
    matchPercentage: 100,
    missingIngredients: [],
    estimatedAdditionalCostTry: 0,
    estimatedCostIsPartial: false,
  },
];

describe("AiService safety and budget gates", () => {
  it("uses an HMAC safety identifier and accepts only candidate recipe IDs", async () => {
    const { service, parse } = createHarness({
      parsed: {
        results: [
          { recipeId: "rec_hayali", reason: "Uydurma." },
          { recipeId: "rec_1", reason: "Güvenli." },
        ],
      },
    });
    const result = await service.rerankRecipes({
      userId: "user_1",
      requestId: "req_1",
      candidates,
      wantsToShop: false,
      budgetTry: null,
    });
    expect(result.value).toEqual([{ recipeId: "rec_1", reason: "Güvenli." }]);
    const request = parse.mock.calls[0][0];
    expect(request.safety_identifier).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.parse(request.input).candidates).toEqual(candidates);
  });

  it("does not call OpenAI when the atomic monthly reservation is denied", async () => {
    const { service, parse, prisma } = createHarness({
      budgetAvailable: false,
    });
    const result = await service.rerankRecipes({
      userId: "user_1",
      requestId: "req_2",
      candidates,
      wantsToShop: false,
      budgetTry: null,
    });
    expect(result).toMatchObject({
      fallback: true,
      fallbackReason: "monthly_budget_exceeded",
    });
    expect(parse).not.toHaveBeenCalled();
    expect(prisma.aiUsage.create).toHaveBeenCalledOnce();
  });

  it("releases the reservation and falls back on an invalid recipe ID", async () => {
    const { service, prisma } = createHarness({
      parsed: {
        results: [{ recipeId: "rec_hayali", reason: "Uydurma." }],
      },
    });
    const result = await service.rerankRecipes({
      userId: "user_1",
      requestId: "req_3",
      candidates,
      wantsToShop: false,
      budgetTry: null,
    });
    expect(result).toMatchObject({
      fallback: true,
      fallbackReason: "invalid_output",
    });
    expect(prisma.aiBudgetPeriod.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { remainingUsd: { increment: expect.anything() } },
      }),
    );
  });

  it("sends only the latest ten chat messages", async () => {
    const { service, parse } = createHarness({
      parsed: { answer: "Yanıt", warnings: [] },
    });
    const messages = Array.from({ length: 12 }, (_, index) => ({
      role: "user" as const,
      content: `Mesaj ${index}`,
    }));
    await service.answerRecipeChat({
      userId: "user_1",
      requestId: "req_4",
      recipe: { id: "rec_1", title: "Tarif" },
      messages,
    });
    const sent = JSON.parse(parse.mock.calls[0][0].input);
    expect(sent.conversation).toHaveLength(10);
    expect(sent.conversation[0].content).toBe("Mesaj 2");
  });

  it("falls back without reserving budget when OpenAI is not configured", async () => {
    const { service, prisma } = createHarness({ clientEnabled: false });
    const result = await service.rerankRecipes({
      userId: "user_1",
      requestId: "req_5",
      candidates,
      wantsToShop: false,
      budgetTry: null,
    });
    expect(result.fallbackReason).toBe("openai_not_configured");
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
  });
});
