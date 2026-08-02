import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class RecipeChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveRecipe(recipeId: string) {
    return this.prisma.recipe.findFirst({
      where: {
        id: recipeId,
        datasetImport: { active: true, status: "COMPLETED" },
      },
      include: {
        ingredients: { orderBy: { position: "asc" } },
        steps: { orderBy: { order: "asc" } },
      },
    });
  }

  createSession(userId: string, recipeId: string) {
    return this.prisma.recipeChatSession.create({ data: { userId, recipeId } });
  }

  findOwnedSession(userId: string, sessionId: string) {
    return this.prisma.recipeChatSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        recipe: {
          include: {
            ingredients: { orderBy: { position: "asc" } },
            steps: { orderBy: { order: "asc" } },
          },
        },
      },
    });
  }

  listMessages(sessionId: string, take = 100) {
    return this.prisma.recipeChatMessage.findMany({
      where: { sessionId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take,
    });
  }

  listRecentMessages(sessionId: string, take = 10) {
    return this.prisma.recipeChatMessage.findMany({
      where: { sessionId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take,
    });
  }

  addMessage(
    sessionId: string,
    role: "USER" | "ASSISTANT",
    content: string,
    metadata: {
      provider?: string;
      model?: string;
      fallback?: boolean;
      fallbackReason?: string;
    } = {},
  ) {
    return this.prisma.recipeChatMessage.create({
      data: { sessionId, role, content, ...metadata },
    });
  }
}
