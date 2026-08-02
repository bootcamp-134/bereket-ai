import { Injectable, NotFoundException } from "@nestjs/common";
import type { IncomeLevel, UserProfile } from "@prisma/client";
import { ApiCode } from "../../common/api-code";
import { profileComplete } from "../../common/profile-complete";
import type { UpdateProfileDto } from "./dto";
import { UsersRepository } from "./users.repository";

const normalizeList = (values: string[]) => [
  ...new Set(
    values
      .map((value) => value.trim().toLocaleLowerCase("tr-TR"))
      .filter(Boolean),
  ),
];

function serializeProfile(profile: UserProfile | null) {
  if (!profile) return null;
  return {
    fullName: profile.fullName,
    age: profile.age,
    householdSize: profile.householdSize,
    mealsPerDay: profile.mealsPerDay,
    incomeLevel: profile.incomeLevel?.toLowerCase() ?? null,
    weeklyFoodBudget:
      profile.weeklyFoodBudget === null
        ? null
        : Number(profile.weeklyFoodBudget),
    dietPreferences: profile.dietPreferences,
    allergens: profile.allergens,
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async getMe(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException({
        code: ApiCode.NOT_FOUND,
        message: "Kullanıcı bulunamadı.",
      });
    }
    return {
      id: user.id,
      email: user.email,
      profile: serializeProfile(user.profile),
      profileComplete: profileComplete(user.profile),
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.users.updateProfile(userId, {
      ...dto,
      fullName: dto.fullName?.trim(),
      incomeLevel: dto.incomeLevel?.toUpperCase() as IncomeLevel | undefined,
      dietPreferences: dto.dietPreferences
        ? normalizeList(dto.dietPreferences)
        : undefined,
      allergens: dto.allergens ? normalizeList(dto.allergens) : undefined,
    });
    return serializeProfile(profile);
  }
}
