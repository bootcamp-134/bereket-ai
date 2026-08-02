import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { UpdateProfileDto } from "../src/modules/users/dto";
import { RecommendRecipesDto } from "../src/modules/recommendations/dto";

describe("API DTO contract", () => {
  it("rejects null profile values but permits [] to clear arrays", async () => {
    const invalid = await validate(
      plainToInstance(UpdateProfileDto, { fullName: null }),
    );
    const valid = await validate(
      plainToInstance(UpdateProfileDto, { allergens: [] }),
    );
    expect(invalid.length).toBeGreaterThan(0);
    expect(valid).toHaveLength(0);
  });

  it("requires a budget when wantsToShop is true", async () => {
    const errors = await validate(
      plainToInstance(RecommendRecipesDto, {
        availableIngredients: ["domates"],
        wantsToShop: true,
      }),
    );
    expect(errors.some((error) => error.property === "budgetTry")).toBe(true);
  });

  it("limits recommendation input to 20 ingredients", async () => {
    const errors = await validate(
      plainToInstance(RecommendRecipesDto, {
        availableIngredients: Array.from(
          { length: 21 },
          (_, index) => `malzeme-${index}`,
        ),
        wantsToShop: false,
      }),
    );
    expect(
      errors.some((error) => error.property === "availableIngredients"),
    ).toBe(true);
  });
});
