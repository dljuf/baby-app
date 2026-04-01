import { describe, expect, it } from "vitest";
import { checkSupabaseConnection, supabaseQuery, type SupabaseRecipe, type SupabasePremiumPlan } from "./supabase";

describe("External Supabase Connection", () => {
  it("should connect to the external Supabase instance", async () => {
    const connected = await checkSupabaseConnection();
    expect(connected).toBe(true);
  });

  it("should fetch recipes from the recipes table", async () => {
    const { data, count } = await supabaseQuery<SupabaseRecipe>({
      table: "recipes",
      select: "id,naslov,slug,uzrast",
      limit: 3,
      order: "id.asc",
    });

    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBeLessThanOrEqual(3);
    expect(count).toBeGreaterThan(0);

    // Check that the first recipe has expected fields
    const first = data[0];
    expect(first.id).toBeDefined();
    expect(first.naslov).toBeDefined();
    expect(first.slug).toBeDefined();
    expect(first.uzrast).toBeDefined();
  });

  it("should fetch premium plan data", async () => {
    const { data, count } = await supabaseQuery<SupabasePremiumPlan>({
      table: "premium_plan",
      select: "id,uzrast,dan,namirnice",
      limit: 5,
      order: "id.asc",
    });

    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(count).toBeGreaterThan(0);

    const first = data[0];
    expect(first.uzrast).toBeDefined();
    expect(first.dan).toBeDefined();
    expect(first.namirnice).toBeDefined();
  });

  it("should filter recipes by uzrast", async () => {
    const { data } = await supabaseQuery<SupabaseRecipe>({
      table: "recipes",
      select: "id,naslov,uzrast",
      filters: { uzrast: "eq.6" },
      limit: 10,
    });

    expect(data).toBeDefined();
    for (const recipe of data) {
      expect(recipe.uzrast).toBe("6");
    }
  });
});
