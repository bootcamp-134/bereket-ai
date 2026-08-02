import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/current-user.decorator";
import { Public } from "../../common/public.decorator";
import { RateLimit } from "../../common/rate-limit.decorator";
import type {
  AuthenticatedUser,
  RequestWithContext,
} from "../../common/request-id.middleware";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @RateLimit({ limit: 5, windowSeconds: 60, scope: "ip" })
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @RateLimit({ limit: 5, windowSeconds: 60, scope: "ip" })
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @RateLimit({ limit: 20, windowSeconds: 60, scope: "ip" })
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiBearerAuth()
  @RateLimit({ limit: 20, windowSeconds: 60, scope: "session" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("logout")
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.logout(user.sessionId);
  }

  @Public()
  @RateLimit({ limit: 5, windowSeconds: 60, scope: "ip" })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post("forgot-password")
  async forgotPassword(
    @Req() request: RequestWithContext,
    @Body() dto: ForgotPasswordDto,
  ) {
    await this.authService.forgotPassword(dto, request.requestId);
    return { accepted: true };
  }

  @Public()
  @RateLimit({ limit: 5, windowSeconds: 60, scope: "ip" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
  }
}
