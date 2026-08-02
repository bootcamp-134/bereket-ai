import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";

const candidateInclude = {
  ingredients: { orderBy: { position: "asc" as const } },
} satisfies Prisma.RecipeInclude;

@Injectable()
export class RecommendationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async resolveIngredientNames(normalizedAliases: string[]) {
    const aliases = await this.prisma.ingredientAlias.findMany({
      where: { normalizedAlias: { in: normalizedAliases } },
      include: { ingredient: true },
    });
    return aliases.map((item) => item.ingredient.normalizedName);
  }

  findCandidates() {
    return this.prisma.recipe.findMany({
      where: { datasetImport: { active: true, status: "COMPLETED" } },
      include: candidateInclude,
      orderBy: { id: "asc" },
    });
  }

  findProfile(userId: string) {
    return this.prisma.userProfile.findUnique({ where: { userId } });
  }
}

export type CandidateRecipe = Awaited<
  ReturnType<RecommendationsRepository["findCandidates"]>
>[number];
