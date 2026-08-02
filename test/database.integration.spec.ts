import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const integration =
  process.env.RUN_DATABASE_TESTS === "true" ? describe : describe.skip;

integration("PostgreSQL migration and dataset integration", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    const connectionString =
      process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
    if (!connectionString)
      throw new Error("Database integration URL is missing.");
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  afterAll(async () => prisma?.$disconnect());

  it("has the checksum-verified active dataset with nullable cost data", async () => {
    const dataset = await prisma.datasetImport.findFirst({
      where: { active: true, status: "COMPLETED" },
    });
    expect(dataset).toMatchObject({
      checksum:
        "63c0fdf21fe854477d31aa803de9be61e901a6b6ed37609217db9b71b3278c9b",
      recipeCount: 3005,
      ingredientCount: 27382,
      pricedCount: 21331,
    });
    expect(
      await prisma.recipe.count({ where: { datasetImportId: dataset?.id } }),
    ).toBe(3005);
    expect(
      await prisma.recipeIngredient.count({
        where: {
          recipe: { datasetImportId: dataset?.id },
          defaultEstimatedCostTry: null,
        },
      }),
    ).toBeGreaterThan(0);
  });

  it("enforces chat ownership and cascades scoped test cleanup", async () => {
    const suffix = randomUUID();
    const recipe = await prisma.recipe.findFirstOrThrow({
      where: { datasetImport: { active: true } },
    });
    const [owner, stranger] = await prisma.$transaction([
      prisma.user.create({
        data: { email: `owner-${suffix}@example.test`, passwordHash: "test" },
      }),
      prisma.user.create({
        data: {
          email: `stranger-${suffix}@example.test`,
          passwordHash: "test",
        },
      }),
    ]);
    try {
      const session = await prisma.recipeChatSession.create({
        data: { userId: owner.id, recipeId: recipe.id },
      });
      expect(
        await prisma.recipeChatSession.findFirst({
          where: { id: session.id, userId: stranger.id },
        }),
      ).toBeNull();
    } finally {
      await prisma.user.deleteMany({
        where: { id: { in: [owner.id, stranger.id] } },
      });
    }
  });

  it("increments a persistent rate-limit bucket atomically", async () => {
    const key = `integration-${randomUUID()}`;
    const windowStart = new Date();
    const expiresAt = new Date(Date.now() + 60_000);
    try {
      for (let index = 0; index < 2; index += 1) {
        await prisma.$executeRaw`
          INSERT INTO "RateLimitBucket" ("key", "windowStart", "count", "expiresAt")
          VALUES (${key}, ${windowStart}, 1, ${expiresAt})
          ON CONFLICT ("key", "windowStart")
          DO UPDATE SET "count" = "RateLimitBucket"."count" + 1
        `;
      }
      const bucket = await prisma.rateLimitBucket.findUnique({
        where: { key_windowStart: { key, windowStart } },
      });
      expect(bucket?.count).toBe(2);
    } finally {
      await prisma.rateLimitBucket.deleteMany({ where: { key } });
    }
  });

  it("reserves the monthly AI budget atomically under concurrency", async () => {
    const periodStart = new Date("2099-01-01T00:00:00.000Z");
    try {
      await prisma.aiBudgetPeriod.create({
        data: {
          periodStart,
          limitUsd: "0.01000000",
          remainingUsd: "0.01000000",
        },
      });
      const reservations = await Promise.all(
        Array.from(
          { length: 5 },
          () =>
            prisma.$queryRaw<Array<{ periodStart: Date }>>`
            UPDATE "AiBudgetPeriod"
            SET "remainingUsd" = "remainingUsd" - 0.006,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE "periodStart" = ${periodStart}
              AND "remainingUsd" >= 0.006
            RETURNING "periodStart"
          `,
        ),
      );
      expect(reservations.filter((rows) => rows.length === 1)).toHaveLength(1);
      const period = await prisma.aiBudgetPeriod.findUniqueOrThrow({
        where: { periodStart },
      });
      expect(Number(period.remainingUsd)).toBeCloseTo(0.004, 8);
    } finally {
      await prisma.aiBudgetPeriod.deleteMany({ where: { periodStart } });
    }
  });
});
