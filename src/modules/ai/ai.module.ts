import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { openAiClientProvider } from "./openai.provider";

@Module({
  providers: [openAiClientProvider, AiService],
  exports: [AiService],
})
export class AiModule {}
