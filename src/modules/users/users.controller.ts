import { Body, Controller, Get, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/current-user.decorator";
import { RateLimit } from "../../common/rate-limit.decorator";
import type { AuthenticatedUser } from "../../common/request-id.middleware";
import { UpdateProfileDto } from "./dto";
import { UsersService } from "./users.service";

@ApiBearerAuth()
@ApiTags("users")
@Controller("me")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMe(user.id);
  }

  @Patch("profile")
  @RateLimit({ limit: 30, windowSeconds: 60, scope: "user" })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
