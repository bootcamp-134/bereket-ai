import { Logger, RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { APP_VERSION } from "./common/app-version";
import { ApiExceptionFilter } from "./common/api-exception.filter";
import {
  configuredCorsOrigins,
  createCorsOriginGuard,
} from "./common/cors-origin.middleware";
import { validateEnvironment } from "./config/environment";

async function bootstrap() {
  validateEnvironment(process.env);
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger("Bootstrap");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.setGlobalPrefix("api/v1", {
    exclude: [{ path: "", method: RequestMethod.GET }],
  });
  app.use(createCorsOriginGuard(configuredCorsOrigins(), logger));
  app.enableCors({
    credentials: true,
    origin: true,
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
      .setVersion(APP_VERSION)
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
