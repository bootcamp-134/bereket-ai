import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/current-user.decorator";
import { RateLimit } from "../../common/rate-limit.decorator";
import type {
  AuthenticatedUser,
  RequestWithContext,
} from "../../common/request-id.middleware";
import { RecommendRecipesDto } from "./dto";
import { RecommendationsService } from "./recommendations.service";

@ApiBearerAuth()
@ApiTags("recommendations")
@Controller("recommendations")
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post("recipes")
  @RateLimit({ limit: 20, windowSeconds: 60, scope: "user" })
  recommendRecipes(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
    @Body() dto: RecommendRecipesDto,
  ) {
    return this.recommendationsService.recommendRecipes(
      user.id,
      request.requestId,
      dto,
    );
  }
}
