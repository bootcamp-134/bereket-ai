import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { configureSwagger } from "../src/swagger";

describe("Swagger documentation", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({}).compile();
    app = module.createNestApplication();
    configureSwagger(app);
    await app.init();
  });

  afterAll(async () => app.close());

  it("serves a serverless-safe UI without local asset requests", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/docs")
      .expect(200)
      .expect("content-type", /html/);

    expect(response.text).toContain(
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.8/swagger-ui-bundle.js",
    );
    expect(response.text).toContain('url: "/api/docs-json"');
    expect(response.text).not.toContain("/api/docs/swagger-ui-bundle.js");
  });

  it("serves the OpenAPI document", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/docs-json")
      .expect(200)
      .expect("content-type", /json/);

    expect(response.body).toMatchObject({
      openapi: "3.0.0",
      info: { title: "Bereket AI Backend API" },
    });
  });
});
