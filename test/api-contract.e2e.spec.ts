import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { ApiExceptionFilter } from "../src/common/api-exception.filter";
import { PrismaService } from "../src/database/prisma.service";

describe("production API contract", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      "postgresql://unused:unused@localhost:5432/unused";
    process.env.JWT_ACCESS_SECRET =
      "test-jwt-access-secret-at-least-32-characters";
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({ $disconnect: async () => undefined })
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

  afterAll(async () => app.close());

  it("redirects the API root to Swagger", async () => {
    await request(app.getHttpServer())
      .get("/")
      .expect(308)
      .expect("location", "/api/docs");
  });

  it("returns the standard error envelope for a protected endpoint", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/recipes")
      .expect(401);
    expect(response.body).toMatchObject({
      error: {
        code: "AUTHENTICATION_REQUIRED",
        requestId: expect.stringMatching(/^req_/),
      },
    });
  });

  it("publishes only the intended V1 endpoint families", () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Bereket AI")
        .setVersion("1")
        .addBearerAuth()
        .build(),
    );
    const paths = Object.keys(document.paths);
    expect(paths).toEqual(
      expect.arrayContaining([
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/refresh",
        "/api/v1/auth/logout",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/v1/me",
        "/api/v1/me/profile",
        "/api/v1/recipes",
        "/api/v1/recipes/{id}",
        "/api/v1/recommendations/recipes",
        "/api/v1/recipe-chat/sessions",
        "/api/v1/recipe-chat/sessions/{sessionId}/messages",
      ]),
    );
    expect(
      paths.some(
        (path) =>
          path.includes("feed") ||
          path.includes("achievements") ||
          path.includes("internal"),
      ),
    ).toBe(false);
  });
});
