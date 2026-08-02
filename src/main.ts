import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/api-exception.filter";

function requireProductionEnvironment() {
  if (process.env.NODE_ENV !== "production") return;
  const required = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "REFRESH_TOKEN_PEPPER",
    "PASSWORD_RESET_TOKEN_PEPPER",
    "OPENAI_API_KEY",
    "RESEND_API_KEY",
  ];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length)
    throw new Error(
      `Eksik production environment değişkenleri: ${missing.join(", ")}`,
    );
}

function corsOrigins() {
  const configured = (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([
    "https://bereket.app",
    "https://www.bereket.app",
    ...configured,
  ]);
}

async function bootstrap() {
  requireProductionEnvironment();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.setGlobalPrefix("api/v1");
  const allowedOrigins = corsOrigins();
  app.enableCors({
    credentials: true,
    origin(
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) {
      if (
        !origin ||
        allowedOrigins.has(origin) ||
        (process.env.NODE_ENV !== "production" &&
          /^http:\/\/localhost:\d+$/.test(origin))
      ) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS origin reddedildi."), false);
    },
  });
  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
    }),
  );

  if (process.env.SWAGGER_ENABLED !== "false") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Bereket AI Backend API")
      .setDescription(
        "Bereket AI production auth, recipe recommendation and recipe chat API.",
      )
      .setVersion("1.0.0")
      .addServer("https://api.bereket.app", "Production")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document, {
      jsonDocumentUrl: "api/docs-json",
      customSiteTitle: "Bereket AI API",
    });
  }

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
