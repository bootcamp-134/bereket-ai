import { describe, expect, it } from "vitest";
import { profileComplete } from "../src/common/profile-complete";

const completeProfile = {
  fullName: "Samet Dönmez",
  age: 28,
  householdSize: 2,
  mealsPerDay: 3,
  incomeLevel: "MIDDLE",
  weeklyFoodBudget: 1500,
  dietPreferences: ["balanced"],
};

describe("profileComplete", () => {
  it("accepts a profile containing every onboarding field", () => {
    expect(profileComplete(completeProfile)).toBe(true);
  });

  it("rejects missing and blank onboarding values", () => {
    expect(profileComplete(null)).toBe(false);
    expect(profileComplete({ ...completeProfile, fullName: "  " })).toBe(false);
    expect(profileComplete({ ...completeProfile, dietPreferences: [] })).toBe(
      false,
    );
  });
});
