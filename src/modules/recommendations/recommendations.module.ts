import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { RecipesModule } from "../recipes/recipes.module";
import { RecommendationsController } from "./recommendations.controller";
import { RecommendationsRepository } from "./recommendations.repository";
import { RecommendationsService } from "./recommendations.service";

@Module({
  controllers: [RecommendationsController],
  imports: [AiModule, RecipesModule],
  providers: [RecommendationsRepository, RecommendationsService],
})
export class RecommendationsModule {}
