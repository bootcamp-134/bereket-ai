import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";

const fullRecipe = {
  ingredients: { orderBy: { position: "asc" as const } },
  steps: { orderBy: { order: "asc" as const } },
} satisfies Prisma.RecipeInclude;

@Injectable()
export class RecipesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: {
    search?: string;
    category?: string;
    difficulty?: string;
    excludeAllergens: string[];
    page: number;
    pageSize: number;
  }) {
    const where: Prisma.RecipeWhereInput = {
      datasetImport: { active: true, status: "COMPLETED" },
      ...(input.search
        ? { title: { contains: input.search.trim(), mode: "insensitive" } }
        : {}),
      ...(input.category
        ? { category: { equals: input.category, mode: "insensitive" } }
        : {}),
      ...(input.difficulty
        ? { difficulty: { equals: input.difficulty, mode: "insensitive" } }
        : {}),
      ...(input.excludeAllergens.length
        ? { NOT: { allergenCategories: { hasSome: input.excludeAllergens } } }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.recipe.findMany({
        where,
        include: fullRecipe,
        orderBy: [{ title: "asc" }, { id: "asc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prisma.recipe.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string) {
    return this.prisma.recipe.findFirst({
      where: { id, datasetImport: { active: true, status: "COMPLETED" } },
      include: fullRecipe,
    });
  }
}

export type RecipeWithDetails = NonNullable<
  Awaited<ReturnType<RecipesRepository["findById"]>>
>;
