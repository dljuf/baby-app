/**
 * Pure helper functions for recipe data transformation.
 * No router or procedure dependencies — safe to import from any module.
 */
import {
  supabaseQuery,
  type SupabaseRecipe,
  type SupabaseRecipeTranslation,
} from "../supabase";
import { TRANSLATABLE_LANG_CODES } from "@shared/domain";

/**
 * Build optimized Supabase image URLs using Image Transformations.
 */
export function cleanImageUrl(url: string | null | undefined, width: number = 400): string {
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

/**
 * Parse a comma-separated ingredients string into a trimmed, non-empty string array.
 * Handles the raw DB value from `sastojci` / translation overlay.
 */
export function parseIngredients(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * Parse a period-delimited steps string into a trimmed, non-empty string array.
 * Handles the raw DB value from `koraci` / translation overlay.
 */
export function parseSteps(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(".").map((s) => s.trim()).filter(Boolean);
}

/**
 * Fetch translations for a batch of recipe IDs in a given language.
 * Returns a Map of recipe_id -> translation.
 */
export async function fetchTranslations(
  recipeIds: number[],
  lang: string
): Promise<Map<number, SupabaseRecipeTranslation>> {
  if (!lang || !(TRANSLATABLE_LANG_CODES as readonly string[]).includes(lang)) {
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
export function applyTranslation(
  recipe: SupabaseRecipe,
  translation: SupabaseRecipeTranslation | undefined
): SupabaseRecipe {
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
