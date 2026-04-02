/**
 * Hook for fetching recipes from the backend Supabase API via tRPC.
 * Passes the current i18n language to get translated content.
 *
 * The backend is responsible for parsing raw DB strings into structured arrays.
 * This hook maps the tRPC response shape to the UI-facing RecipeDetail type
 * without performing any string splitting or data transformation.
 */
import { trpc } from '@/lib/trpc';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface RecipeListItem {
  id: string;
  name: string;
  slug: string;
  age: string;
  texture: string;
  prepTime: string;
  totalTime: string;
  calories: string | null;
  image: string;
}

export interface RecipeDetail {
  id: string;
  name: string;
  slug: string;
  age: string;
  texture: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: string[];
  steps: string[];
  allergens: string | null;
  nutritionNotes: string | null;
  gptNutri: string | null;
  calories: string | null;
  image: string;
  published: boolean;
}

function mapListItem(r: {
  id: number;
  title: string;
  slug: string;
  age: string;
  texture: string;
  prepTime: string;
  totalTime: string;
  calories: string | null;
  image: string;
}): RecipeListItem {
  return {
    id: String(r.id),
    name: r.title,
    slug: r.slug,
    age: r.age,
    texture: r.texture,
    prepTime: r.prepTime,
    totalTime: r.totalTime,
    calories: r.calories,
    image: r.image,
  };
}

function mapDetail(r: {
  id: number;
  title: string;
  slug: string;
  age: string;
  texture: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: string[];
  steps: string[];
  allergens: string | null;
  nutritionNotes: string | null;
  gptNutri: string | null;
  calories: string | null;
  image: string;
  published: boolean;
}): RecipeDetail {
  return {
    id: String(r.id),
    name: r.title,
    slug: r.slug,
    age: r.age,
    texture: r.texture,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    totalTime: r.totalTime,
    // Backend already returns structured arrays — no parsing needed here.
    ingredients: r.ingredients,
    steps: r.steps,
    allergens: r.allergens,
    nutritionNotes: r.nutritionNotes,
    gptNutri: r.gptNutri,
    calories: r.calories,
    image: r.image,
    published: r.published,
  };
}

/**
 * Get the current i18n language code for API requests.
 * Maps i18n language codes to the codes used in recipe_translations table.
 */
function useCurrentLang(): string {
  const { i18n } = useTranslation();
  // i18n.language might be 'en-US' or 'en', we just need the base
  const lang = i18n.language?.split('-')[0] || 'sr';
  return lang;
}

/** Fetch all recipes (list view) with optional filters */
export function useRecipeList(filters?: { uzrast?: string; tekstura?: string; search?: string }) {
  const lang = useCurrentLang();

  const { data, isLoading, error } = trpc.recipes.list.useQuery({
    uzrast: filters?.uzrast,
    tekstura: filters?.tekstura,
    search: filters?.search,
    lang,
    limit: 200,
    offset: 0,
  });

  const recipes = useMemo(() => {
    if (!data?.recipes) return [];
    return data.recipes.map(mapListItem);
  }, [data]);

  return { recipes, total: data?.total ?? 0, isLoading, error };
}

/** Fetch a single recipe by ID */
export function useRecipeById(id: string | undefined) {
  const lang = useCurrentLang();
  const numId = id ? parseInt(id, 10) : 0;

  const { data, isLoading, error } = trpc.recipes.byId.useQuery(
    { id: numId, lang },
    { enabled: !!id && numId > 0 }
  );

  const recipe = useMemo(() => {
    if (!data) return null;
    return mapDetail(data);
  }, [data]);

  return { recipe, isLoading, error };
}

/** Fetch a single recipe by slug */
export function useRecipeBySlug(slug: string | undefined) {
  const lang = useCurrentLang();

  const { data, isLoading, error } = trpc.recipes.bySlug.useQuery(
    { slug: slug ?? '', lang },
    { enabled: !!slug }
  );

  const recipe = useMemo(() => {
    if (!data) return null;
    return mapDetail(data);
  }, [data]);

  return { recipe, isLoading, error };
}

/** Fetch all available age groups */
export function useAgeGroups() {
  return trpc.recipes.ageGroups.useQuery();
}

/** Fetch all available textures */
export function useTextures() {
  return trpc.recipes.textures.useQuery();
}
