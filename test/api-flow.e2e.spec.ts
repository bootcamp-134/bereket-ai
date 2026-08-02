import "reflect-metadata";
import {
  type INestApplication,
  RequestMethod,
  ValidationPipe,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { ApiExceptionFilter } from "../src/common/api-exception.filter";
import { PrismaService } from "../src/database/prisma.service";
import { OPENAI_CLIENT } from "../src/modules/ai/openai.provider";
import { RESEND_CLIENT } from "../src/modules/auth/resend.provider";

const integration =
  process.env.RUN_DATABASE_TESTS === "true" ? describe : describe.skip;

integration("complete production API flow", () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let ownerId: string;
  let strangerId: string;
  const suffix = crypto.randomUUID();
  const ownerEmail = `api-owner-${suffix}@example.test`;
  const strangerEmail = `api-stranger-${suffix}@example.test`;
  const password = "Guclu-test-sifresi-123";
  const parse = vi.fn(async (input: { input: string }) => {
    const payload = JSON.parse(input.input);
    if (Array.isArray(payload.candidates)) {
      return {
        id: `resp_recommendation_${suffix}`,
        output_parsed: {
          results: [
            {
              recipeId: payload.candidates[0].id,
              reason: "Malzeme uyumu yüksek ve güvenlik filtrelerinden geçti.",
            },
          ],
        },
        usage: {
          input_tokens: 120,
          input_tokens_details: { cached_tokens: 0 },
          output_tokens: 30,
        },
      };
    }
    return {
      id: `resp_chat_${suffix}`,
      output_parsed: {
        answer: "Tarifteki adımları sırayla izleyin.",
        warnings: [],
      },
      usage: {
        input_tokens: 100,
        input_tokens_details: { cached_tokens: 0 },
        output_tokens: 20,
      },
    };
  });

  beforeAll(async () => {
    const connectionString =
      process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
    if (!connectionString)
      throw new Error("Database integration URL is missing.");
    process.env.JWT_ACCESS_SECRET ??=
      "e2e-jwt-access-secret-at-least-32-characters";
    process.env.REFRESH_TOKEN_PEPPER ??=
      "e2e-refresh-pepper-at-least-32-characters";
    process.env.PASSWORD_RESET_TOKEN_PEPPER ??=
      "e2e-reset-pepper-at-least-32-characters--";
    process.env.OPENAI_SAFETY_PEPPER ??=
      "e2e-openai-safety-at-least-32-characters";

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(OPENAI_CLIENT)
      .useValue({ responses: { parse } })
      .overrideProvider(RESEND_CLIENT)
      .useValue({
        emails: { send: vi.fn().mockResolvedValue({ error: null }) },
      })
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix("api/v1", {
      exclude: [{ path: "", method: RequestMethod.GET }],
    });
    app.useGlobalFilters(new ApiExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.user.deleteMany({
        where: { email: { in: [ownerEmail, strangerEmail] } },
      });
      await prisma.$disconnect();
    }
    await app?.close();
  });

  it("runs auth, profile, recipes, recommendation and owned chat end to end", async () => {
    const ownerRegistration = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({ email: ownerEmail, password, fullName: "API Owner" })
      .expect(201);
    ownerId = ownerRegistration.body.data.user.id;
    const ownerAccessToken = ownerRegistration.body.data.tokens.accessToken;
    const firstRefreshToken = ownerRegistration.body.data.tokens.refreshToken;

    const strangerRegistration = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({ email: strangerEmail, password, fullName: "API Stranger" })
      .expect(201);
    strangerId = strangerRegistration.body.data.user.id;
    const strangerAccessToken =
      strangerRegistration.body.data.tokens.accessToken;

    await request(app.getHttpServer())
      .patch("/api/v1/me/profile")
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .send({
        age: 28,
        householdSize: 2,
        mealsPerDay: 3,
        incomeLevel: "middle",
        weeklyFoodBudget: 1500,
        dietPreferences: ["balanced"],
        allergens: [],
      })
      .expect(200);

    const me = await request(app.getHttpServer())
      .get("/api/v1/me")
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .expect(200);
    expect(me.body.data).toMatchObject({ id: ownerId, profileComplete: true });

    const recipe = await prisma.recipe.findFirstOrThrow({
      where: {
        datasetImport: { active: true, status: "COMPLETED" },
        totalIngredientCount: { lte: 20, gt: 0 },
      },
      include: { ingredients: { orderBy: { position: "asc" } } },
      orderBy: { id: "asc" },
    });
    const recipeResponse = await request(app.getHttpServer())
      .get(`/api/v1/recipes/${recipe.id}`)
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .expect(200);
    expect(recipeResponse.body.data.id).toBe(recipe.id);

    const recommendation = await request(app.getHttpServer())
      .post("/api/v1/recommendations/recipes")
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .send({
        availableIngredients: recipe.ingredients.map(
          (item) => item.displayName,
        ),
        wantsToShop: false,
      })
      .expect(201);
    expect(recommendation.body.data.results.length).toBeGreaterThan(0);
    expect(recommendation.body.data.generatedBy).toBe("openai");

    const session = await request(app.getHttpServer())
      .post("/api/v1/recipe-chat/sessions")
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .send({ recipeId: recipe.id })
      .expect(201);
    const sessionId = session.body.data.id;

    await request(app.getHttpServer())
      .get(`/api/v1/recipe-chat/sessions/${sessionId}/messages`)
      .set("authorization", `Bearer ${strangerAccessToken}`)
      .expect(404);

    const chat = await request(app.getHttpServer())
      .post(`/api/v1/recipe-chat/sessions/${sessionId}/messages`)
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .send({ message: "Bu tarifi hangi sırayla yapmalıyım?" })
      .expect(201);
    expect(chat.body.data.assistantMessage).toMatchObject({ fallback: false });

    const messages = await request(app.getHttpServer())
      .get(`/api/v1/recipe-chat/sessions/${sessionId}/messages`)
      .set("authorization", `Bearer ${ownerAccessToken}`)
      .expect(200);
    expect(messages.body.data).toHaveLength(2);
    expect(parse).toHaveBeenCalledTimes(2);

    const rotated = await request(app.getHttpServer())
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: firstRefreshToken })
      .expect(200);
    expect(rotated.body.data.tokens.refreshToken).not.toBe(firstRefreshToken);
    await request(app.getHttpServer())
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: firstRefreshToken })
      .expect(401);
  });

  it("does not disclose whether a forgot-password account exists", async () => {
    const existing = await request(app.getHttpServer())
      .post("/api/v1/auth/forgot-password")
      .send({ email: ownerEmail })
      .expect(202);
    const missing = await request(app.getHttpServer())
      .post("/api/v1/auth/forgot-password")
      .send({ email: `missing-${suffix}@example.test` })
      .expect(202);
    expect(existing.body.data).toEqual(missing.body.data);
    expect(ownerId).toBeTruthy();
    expect(strangerId).toBeTruthy();
  });
});
