import { describe, expect, it } from "vitest";
import { inferAllergens, normalizeTurkish } from "../src/common/normalize";

describe("Turkish normalization and allergen inference", () => {
  it("normalizes Turkish characters and whitespace deterministically", () => {
    expect(normalizeTurkish("  YOĞURTLU   Şehriye  ")).toBe("yogurtlu sehriye");
  });

  it("infers conservative allergen categories without claiming verified data", () => {
    expect(
      inferAllergens(["buğday unu", "yoğurt", "yumurta", "tahin"]),
    ).toEqual(expect.arrayContaining(["gluten", "sut", "yumurta", "susam"]));
  });
});
