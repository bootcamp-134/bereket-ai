import { Logger, RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/api-exception.filter";
import {
  configuredCorsOrigins,
  createCorsOriginGuard,
} from "./common/cors-origin.middleware";
import { validateEnvironment } from "./config/environment";
import { configureSwagger } from "./swagger";

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
    configureSwagger(app);
  }

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
