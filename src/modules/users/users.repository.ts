import { Injectable } from "@nestjs/common";
import type { IncomeLevel } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }

  updateProfile(
    userId: string,
    input: {
      fullName?: string;
      age?: number;
      householdSize?: number;
      mealsPerDay?: number;
      incomeLevel?: IncomeLevel;
      weeklyFoodBudget?: number;
      dietPreferences?: string[];
      allergens?: string[];
    },
  ) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...input },
      update: input,
    });
  }
}
