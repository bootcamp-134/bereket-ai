import { describe, expect, it } from "vitest";
import { agentEvalCases } from "./agent-eval.fixture";

describe("Turkish agent evaluation fixture", () => {
  it("contains at least 30 unique security, budget and fallback cases", () => {
    expect(agentEvalCases.length).toBeGreaterThanOrEqual(30);
    expect(new Set(agentEvalCases.map(([id]) => id)).size).toBe(
      agentEvalCases.length,
    );
    const categories = new Set(
      agentEvalCases.map(([, , category]) => category),
    );
    expect(categories.has("allergen")).toBe(true);
    expect(categories.has("budget")).toBe(true);
    expect(categories.has("injection")).toBe(true);
    expect(categories.has("fallback")).toBe(true);
  });
});
