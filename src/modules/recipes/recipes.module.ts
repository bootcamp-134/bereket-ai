import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesRepository } from "./recipes.repository";
import { RecipesService } from "./recipes.service";

@Module({
  controllers: [RecipesController],
  providers: [RecipesRepository, RecipesService],
  exports: [RecipesRepository, RecipesService],
})
export class RecipesModule {}
