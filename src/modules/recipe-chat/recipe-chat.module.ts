import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { RecipeChatController } from "./recipe-chat.controller";
import { RecipeChatRepository } from "./recipe-chat.repository";
import { RecipeChatService } from "./recipe-chat.service";

@Module({
  controllers: [RecipeChatController],
  imports: [AiModule],
  providers: [RecipeChatRepository, RecipeChatService],
})
export class RecipeChatModule {}
