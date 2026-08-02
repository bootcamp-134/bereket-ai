import { MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./common/auth.guard";
import { RateLimitGuard } from "./common/rate-limit.guard";
import { RequestIdMiddleware } from "./common/request-id.middleware";
import { RequestLoggingMiddleware } from "./common/request-logging.middleware";
import { ResponseInterceptor } from "./common/response.interceptor";
import { validateEnvironment } from "./config/environment";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { MaintenanceModule } from "./modules/maintenance/maintenance.module";
import { RecipeChatModule } from "./modules/recipe-chat/recipe-chat.module";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { RecommendationsModule } from "./modules/recommendations/recommendations.module";
import { UsersModule } from "./modules/users/users.module";
import { RootController } from "./root.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      validate: validateEnvironment,
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    MaintenanceModule,
    UsersModule,
    RecipesModule,
    RecommendationsModule,
    RecipeChatModule,
  ],
  controllers: [RootController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, RequestLoggingMiddleware)
      .forRoutes("*");
  }
}
