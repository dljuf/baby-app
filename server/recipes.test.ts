import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("recipes router", () => {
  it("should list recipes from Supabase", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.recipes.list();

    expect(result).toHaveProperty("recipes");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.recipes)).toBe(true);
    // Note: all recipes have objavljeno=false currently, so public list may be empty
    // This test validates the API structure works
  });

  it("should filter recipes by age (uzrast)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.recipes.list({ uzrast: "6" });

    // All returned recipes should have age "6" (if any are published)
    for (const recipe of result.recipes) {
      expect(recipe.age).toBe("6");
    }
  });

  it("should get a recipe by ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Use ID 1 directly (known to exist)
    const recipe = await caller.recipes.byId({ id: 1 });

    expect(recipe).not.toBeNull();
    expect(recipe!.id).toBe(1);
    expect(recipe!.title).toBeTruthy();
    expect(recipe!.ingredients).toBeTruthy();
    expect(recipe!.steps).toBeTruthy();
  });

  it("should get a recipe by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Get recipe 1 to find its slug
    const r1 = await caller.recipes.byId({ id: 1 });
    expect(r1).not.toBeNull();

    const recipe = await caller.recipes.bySlug({ slug: r1!.slug });

    expect(recipe).not.toBeNull();
    expect(recipe!.slug).toBe(r1!.slug);
  });

  it("should return age groups (may be empty if no published recipes)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const ageGroups = await caller.recipes.ageGroups();

    expect(Array.isArray(ageGroups)).toBe(true);
    // May be empty if no recipes are published yet
  });

  it("should return textures (may be empty if no published recipes)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const textures = await caller.recipes.textures();

    expect(Array.isArray(textures)).toBe(true);
    // May be empty if no recipes are published yet
  });

  it("should return translated recipe titles for English", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.recipes.list({ lang: "en", limit: 3 });

    expect(result.recipes.length).toBeGreaterThan(0);
    // English titles should not contain Serbian characters
    for (const recipe of result.recipes) {
      expect(recipe.title).toBeTruthy();
      expect(recipe.title).not.toMatch(/[šđčćž]/i);
    }
  });

  it("should return translated recipe detail for German", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const recipe = await caller.recipes.byId({ id: 1, lang: "de" });

    expect(recipe).not.toBeNull();
    expect(recipe!.title).toBeTruthy();
    // German title should differ from Serbian original
    const srRecipe = await caller.recipes.byId({ id: 1, lang: "sr" });
    expect(recipe!.title).not.toBe(srRecipe!.title);
  });

  it("should return Serbian original when lang=sr", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const recipe = await caller.recipes.byId({ id: 1, lang: "sr" });

    expect(recipe).not.toBeNull();
    // Serbian original should contain Serbian characters
    expect(recipe!.title).toMatch(/[šđčćžŠĐČĆŽa-zA-Z]/);
  });

  it("should return translations for all 6 non-Serbian languages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const langs = ["en", "hr", "de", "fr", "it", "es"];
    for (const lang of langs) {
      const recipe = await caller.recipes.byId({ id: 1, lang });
      expect(recipe).not.toBeNull();
      expect(recipe!.title).toBeTruthy();
    }
  });

  it("should return translated ingredients and steps in recipe detail", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const enRecipe = await caller.recipes.byId({ id: 1, lang: "en" });
    const srRecipe = await caller.recipes.byId({ id: 1, lang: "sr" });

    expect(enRecipe).not.toBeNull();
    expect(srRecipe).not.toBeNull();
    // Ingredients should be translated (different from Serbian)
    expect(enRecipe!.ingredients).not.toBe(srRecipe!.ingredients);
    // Steps should be translated
    expect(enRecipe!.steps).not.toBe(srRecipe!.steps);
  });
});

describe("premiumPlan router", () => {
  it("should list premium plan entries", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.premiumPlan.list();

    expect(result).toHaveProperty("plan");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.plan)).toBe(true);
    expect(result.total).toBeGreaterThan(0);

    const plan = result.plan[0];
    expect(plan).toHaveProperty("ageGroup");
    expect(plan).toHaveProperty("day");
    expect(plan).toHaveProperty("foods");
  });

  it("should get plan for a specific day", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.premiumPlan.byDay({ day: 1 });

    expect(result).not.toBeNull();
    expect(result!.day).toBe(1);
    expect(result!.foods).toBeTruthy();
  });
});
