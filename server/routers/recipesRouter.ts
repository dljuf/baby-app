/**
 * Recipes domain router.
 * Handles recipe listing, detail lookup, and filter metadata (age groups, textures).
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { supabaseQuery, type SupabaseRecipe } from "../supabase";
import {
  cleanImageUrl,
  parseIngredients,
  parseSteps,
  fetchTranslations,
  applyTranslation,
} from "./recipeHelpers";

export const recipesRouter = router({
  /** List recipes with optional filters + language */
  list: publicProcedure
    .input(
      z
        .object({
          uzrast: z.string().optional(),
          tekstura: z.string().optional(),
          search: z.string().optional(),
          lang: z.string().optional(),
          limit: z.number().min(1).max(200).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const filters: Record<string, string> = {};
      const lang = input?.lang || "sr";

      if (input?.uzrast) {
        filters["uzrast"] = `eq.${input.uzrast}`;
      }
      if (input?.tekstura) {
        filters["tekstura"] = `eq.${input.tekstura}`;
      }
      // Search in original Serbian title (always)
      if (input?.search) {
        filters["naslov"] = `ilike.*${input.search}*`;
      }

      const { data, count } = await supabaseQuery<SupabaseRecipe>({
        table: "recipes",
        select:
          "id,naslov,naslov_slike,slug,uzrast,tekstura,vremepripreme,ukupnovreme,kalorijepoobroku,slika",
        filters,
        order: "id.asc",
        limit: input?.limit ?? 50,
        offset: input?.offset ?? 0,
      });

      // Fetch translations for the batch
      const translations = await fetchTranslations(
        data.map((r) => r.id),
        lang
      );

      return {
        recipes: data.map((r) => {
          const t = translations.get(r.id);
          return {
            id: r.id,
            title: t?.naslov || r.naslov,
            titleImage: r.naslov_slike,
            slug: r.slug,
            age: r.uzrast,
            texture: r.tekstura,
            prepTime: r.vremepripreme,
            totalTime: r.ukupnovreme,
            calories: r.kalorijepoobroku,
            image: cleanImageUrl(r.slika),
          };
        }),
        total: count,
      };
    }),

  /** Get a single recipe by slug + language */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string(), lang: z.string().optional() }))
    .query(async ({ input }) => {
      const lang = input.lang || "sr";

      const { data } = await supabaseQuery<SupabaseRecipe>({
        table: "recipes",
        filters: { slug: `eq.${input.slug}` },
        limit: 1,
      });

      if (data.length === 0) return null;

      const r = applyTranslation(
        data[0],
        (await fetchTranslations([data[0].id], lang)).get(data[0].id)
      );

      return {
        id: r.id,
        title: r.naslov,
        titleImage: r.naslov_slike,
        slug: r.slug,
        age: r.uzrast,
        texture: r.tekstura,
        prepTime: r.vremepripreme,
        cookTime: r.vremekuvanja,
        totalTime: r.ukupnovreme,
        ingredients: parseIngredients(r.sastojci),
        steps: parseSteps(r.koraci),
        allergens: r.alergeni,
        nutritionNotes: r.nutritivnenapomene,
        gptNutri: r.gpt_nutri,
        calories: r.kalorijepoobroku,
        image: cleanImageUrl(r.slika, 800),
        published: r.objavljeno,
      };
    }),

  /** Get a single recipe by ID + language */
  byId: publicProcedure
    .input(z.object({ id: z.number(), lang: z.string().optional() }))
    .query(async ({ input }) => {
      const lang = input.lang || "sr";

      const { data } = await supabaseQuery<SupabaseRecipe>({
        table: "recipes",
        filters: { id: `eq.${input.id}` },
        limit: 1,
      });

      if (data.length === 0) return null;

      const r = applyTranslation(
        data[0],
        (await fetchTranslations([data[0].id], lang)).get(data[0].id)
      );

      return {
        id: r.id,
        title: r.naslov,
        titleImage: r.naslov_slike,
        slug: r.slug,
        age: r.uzrast,
        texture: r.tekstura,
        prepTime: r.vremepripreme,
        cookTime: r.vremekuvanja,
        totalTime: r.ukupnovreme,
        ingredients: parseIngredients(r.sastojci),
        steps: parseSteps(r.koraci),
        allergens: r.alergeni,
        nutritionNotes: r.nutritivnenapomene,
        gptNutri: r.gpt_nutri,
        calories: r.kalorijepoobroku,
        image: cleanImageUrl(r.slika, 800),
        published: r.objavljeno,
      };
    }),

  /** Get all unique age groups */
  ageGroups: publicProcedure.query(async () => {
    const { data } = await supabaseQuery<{ uzrast: string }>({
      table: "recipes",
      select: "uzrast",
    });

    const uniqueAges = Array.from(new Set(data.map((d) => d.uzrast))).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    return uniqueAges;
  }),

  /** Get all unique textures */
  textures: publicProcedure.query(async () => {
    const { data } = await supabaseQuery<{ tekstura: string }>({
      table: "recipes",
      select: "tekstura",
    });

    const uniqueTextures = Array.from(
      new Set(data.map((d) => d.tekstura).filter(Boolean))
    );
    return uniqueTextures;
  }),
});
