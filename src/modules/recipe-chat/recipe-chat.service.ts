import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiCode } from "../../common/api-code";
import { AiService } from "../ai/ai.service";
import type {
  CreateRecipeChatSessionDto,
  SendRecipeChatMessageDto,
} from "./dto";
import { RecipeChatRepository } from "./recipe-chat.repository";

const serializeMessage = (message: {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  fallback: boolean;
  createdAt: Date;
}) => ({
  id: message.id,
  role: message.role.toLowerCase(),
  content: message.content,
  fallback: message.fallback,
  createdAt: message.createdAt,
});

@Injectable()
export class RecipeChatService {
  constructor(
    private readonly repository: RecipeChatRepository,
    private readonly ai: AiService,
  ) {}

  async createSession(userId: string, dto: CreateRecipeChatSessionDto) {
    const recipe = await this.repository.findActiveRecipe(dto.recipeId);
    if (!recipe) throw this.notFound();
    const session = await this.repository.createSession(userId, recipe.id);
    return {
      id: session.id,
      recipeId: recipe.id,
      createdAt: session.createdAt,
    };
  }

  async listMessages(userId: string, sessionId: string) {
    const session = await this.repository.findOwnedSession(userId, sessionId);
    if (!session) throw this.notFound();
    const messages = await this.repository.listMessages(sessionId);
    return messages.map(serializeMessage);
  }

  async sendMessage(
    userId: string,
    requestId: string,
    sessionId: string,
    dto: SendRecipeChatMessageDto,
  ) {
    const session = await this.repository.findOwnedSession(userId, sessionId);
    if (!session) throw this.notFound();
    const userMessage = await this.repository.addMessage(
      sessionId,
      "USER",
      dto.message.trim(),
    );
    const recent = (
      await this.repository.listRecentMessages(sessionId, 10)
    ).reverse();
    const recipeContext = {
      id: session.recipe.id,
      title: session.recipe.title,
      description: session.recipe.description,
      ingredients: session.recipe.ingredients.map((item) => ({
        name: item.displayName,
        amount: item.displayAmount === null ? null : Number(item.displayAmount),
        amountText: item.displayAmountText,
        unit: item.displayUnit,
      })),
      steps: session.recipe.steps.map((step) => step.text),
      allergens: session.recipe.allergenCategories,
      allergenDataStatus: session.recipe.allergenDataStatus,
    };
    const aiResult = await this.ai.answerRecipeChat({
      userId,
      requestId,
      recipe: recipeContext,
      messages: recent.map((message) => ({
        role:
          message.role === "USER" ? ("user" as const) : ("assistant" as const),
        content: message.content,
      })),
    });
    const fallbackText =
      "Şu anda yapay zekâ yanıtı alınamıyor. Tarif detayındaki malzeme ve adımları izleyebilir; alerjenler için ürün etiketlerini ayrıca kontrol edebilirsiniz.";
    const assistantMessage = await this.repository.addMessage(
      sessionId,
      "ASSISTANT",
      aiResult.value?.answer ?? fallbackText,
      {
        provider: "openai",
        model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini-2026-03-17",
        fallback: aiResult.fallback,
        fallbackReason: aiResult.fallbackReason ?? undefined,
      },
    );
    return {
      userMessage: serializeMessage(userMessage),
      assistantMessage: serializeMessage(assistantMessage),
      warnings: aiResult.value?.warnings ?? [],
    };
  }

  private notFound() {
    return new NotFoundException({
      code: ApiCode.NOT_FOUND,
      message: "Sohbet oturumu bulunamadı.",
    });
  }
}
