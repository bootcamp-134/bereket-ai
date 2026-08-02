import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/current-user.decorator";
import { RateLimit } from "../../common/rate-limit.decorator";
import type {
  AuthenticatedUser,
  RequestWithContext,
} from "../../common/request-id.middleware";
import { CreateRecipeChatSessionDto, SendRecipeChatMessageDto } from "./dto";
import { RecipeChatService } from "./recipe-chat.service";

@ApiBearerAuth()
@ApiTags("recipe-chat")
@Controller("recipe-chat")
export class RecipeChatController {
  constructor(private readonly recipeChatService: RecipeChatService) {}

  @Post("sessions")
  @RateLimit({ limit: 20, windowSeconds: 60, scope: "user" })
  createSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRecipeChatSessionDto,
  ) {
    return this.recipeChatService.createSession(user.id, dto);
  }

  @Get("sessions/:sessionId/messages")
  listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId") sessionId: string,
  ) {
    return this.recipeChatService.listMessages(user.id, sessionId);
  }

  @Post("sessions/:sessionId/messages")
  @RateLimit({ limit: 15, windowSeconds: 60, scope: "user" })
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
    @Param("sessionId") sessionId: string,
    @Body() dto: SendRecipeChatMessageDto,
  ) {
    return this.recipeChatService.sendMessage(
      user.id,
      request.requestId,
      sessionId,
      dto,
    );
  }
}
