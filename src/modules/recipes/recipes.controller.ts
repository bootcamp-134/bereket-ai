import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RecipeQueryDto } from "./dto";
import { RecipesService } from "./recipes.service";

@ApiTags("recipes")
@ApiBearerAuth()
@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  listRecipes(@Query() query: RecipeQueryDto) {
    return this.recipesService.listRecipes(query);
  }

  @Get(":id")
  getRecipe(@Param("id") id: string) {
    return this.recipesService.getRecipe(id);
  }
}
