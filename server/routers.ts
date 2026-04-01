import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  supabaseQuery,
  type SupabaseRecipe,
  type SupabaseRecipeTranslation,
  type SupabasePremiumPlan,
} from "./supabase";

/**
 * Build optimized Supabase image URLs using Image Transformations.
 */
function cleanImageUrl(url: string | null | undefined, width: number = 400): string {
  if (!url) return "";
  let cleaned = url;
  const qIndex = cleaned.indexOf("?");
  if (qIndex !== -1) {
    cleaned = cleaned.substring(0, qIndex);
  }
  cleaned = cleaned.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  if (!cleaned.includes("/storage/v1/render/image/public/")) {
    cleaned = cleaned.replace("/storage/v1/", "/storage/v1/render/image/");
  }
  cleaned = cleaned.replace(/ /g, "%20");
  cleaned += `?width=${width}&resize=contain`;
  return cleaned;
}

// Languages that have translations in the DB (not 'sr' - that's the original)
const TRANSLATABLE_LANGS = ["en", "hr", "de", "fr", "it", "es"];

/**
 * Fetch translations for a batch of recipe IDs in a given language.
 * Returns a Map of recipe_id -> translation.
 */
async function fetchTranslations(
  recipeIds: number[],
  lang: string
): Promise<Map<number, SupabaseRecipeTranslation>> {
  if (!lang || lang === "sr" || !TRANSLATABLE_LANGS.includes(lang)) {
    return new Map();
  }

  if (recipeIds.length === 0) return new Map();

  // PostgREST supports `in` filter: recipe_id=in.(1,2,3)
  const idsStr = recipeIds.join(",");
  const { data } = await supabaseQuery<SupabaseRecipeTranslation>({
    table: "recipe_translations",
    filters: {
      recipe_id: `in.(${idsStr})`,
      lang: `eq.${lang}`,
    },
    limit: recipeIds.length,
  });

  const map = new Map<number, SupabaseRecipeTranslation>();
  for (const t of data) {
    map.set(t.recipe_id, t);
  }
  return map;
}

/**
 * Apply translation overlay to a recipe's translatable fields.
 * Falls back to original Serbian if no translation exists.
 */
function applyTranslation(
  recipe: SupabaseRecipe,
  translation: SupabaseRecipeTranslation | undefined
) {
  if (!translation) return recipe;
  return {
    ...recipe,
    naslov: translation.naslov || recipe.naslov,
    sastojci: translation.sastojci || recipe.sastojci,
    koraci: translation.koraci || recipe.koraci,
    nutritivnenapomene: translation.nutritivnenapomene || recipe.nutritivnenapomene,
    gpt_nutri: translation.gpt_nutri || recipe.gpt_nutri,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  recipes: router({
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
          ingredients: r.sastojci,
          steps: r.koraci,
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
          ingredients: r.sastojci,
          steps: r.koraci,
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
  }),

  premiumPlan: router({
    /** Get the full food introduction plan */
    list: publicProcedure
      .input(
        z
          .object({
            uzrast: z.string().optional(),
            dayFrom: z.number().optional(),
            dayTo: z.number().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const filters: Record<string, string> = {};

        if (input?.uzrast) {
          filters["uzrast"] = `eq.${input.uzrast}`;
        }
        if (input?.dayFrom !== undefined && input?.dayTo !== undefined) {
          filters["dan"] = `gte.${input.dayFrom}`;
        }

        const { data, count } = await supabaseQuery<SupabasePremiumPlan>({
          table: "premium_plan",
          filters,
          order: "dan.asc",
          limit: 200,
        });

        return {
          plan: data.map((p) => ({
            id: p.id,
            ageGroup: p.uzrast,
            day: p.dan,
            foods: p.namirnice,
            extra1: p.extra1,
            extra2: p.extra2,
          })),
          total: count,
        };
      }),

    /** Get plan for a specific day */
    byDay: publicProcedure
      .input(z.object({ day: z.number() }))
      .query(async ({ input }) => {
        const { data } = await supabaseQuery<SupabasePremiumPlan>({
          table: "premium_plan",
          filters: { dan: `eq.${input.day}` },
          limit: 1,
        });

        if (data.length === 0) return null;

        const p = data[0];
        return {
          id: p.id,
          ageGroup: p.uzrast,
          day: p.dan,
          foods: p.namirnice,
          extra1: p.extra1,
          extra2: p.extra2,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
