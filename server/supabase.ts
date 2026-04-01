/**
 * External Supabase client for connecting to the user's recipe database.
 * Uses EXT_SUPABASE_URL and EXT_SUPABASE_KEY environment variables.
 */

const EXT_SUPABASE_URL = process.env.EXT_SUPABASE_URL ?? "";
const EXT_SUPABASE_KEY = process.env.EXT_SUPABASE_KEY ?? "";

interface SupabaseQueryOptions {
  table: string;
  select?: string;
  filters?: Record<string, string>;
  order?: string;
  limit?: number;
  offset?: number;
}

/**
 * Generic Supabase REST API query helper.
 * Uses PostgREST directly via fetch - no SDK dependency needed.
 */
export async function supabaseQuery<T = unknown>(options: SupabaseQueryOptions): Promise<{ data: T[]; count: number | null }> {
  const { table, select = "*", filters = {}, order, limit, offset } = options;

  const url = new URL(`${EXT_SUPABASE_URL}/rest/v1/${table}`);
  url.searchParams.set("select", select);

  for (const [key, value] of Object.entries(filters)) {
    url.searchParams.set(key, value);
  }

  if (order) {
    url.searchParams.set("order", order);
  }

  const headers: Record<string, string> = {
    apikey: EXT_SUPABASE_KEY,
    Authorization: `Bearer ${EXT_SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "count=exact",
  };

  if (limit !== undefined) {
    const start = offset ?? 0;
    const end = start + limit - 1;
    headers["Range"] = `${start}-${end}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase query failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as T[];

  // Parse count from Content-Range header
  const contentRange = response.headers.get("Content-Range");
  let count: number | null = null;
  if (contentRange) {
    const parts = contentRange.split("/");
    if (parts[1] && parts[1] !== "*") {
      count = parseInt(parts[1], 10);
    }
  }

  return { data, count };
}

/**
 * Check if the Supabase connection is working.
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${EXT_SUPABASE_URL}/rest/v1/recipes?select=id&limit=1`, {
      headers: {
        apikey: EXT_SUPABASE_KEY,
        Authorization: `Bearer ${EXT_SUPABASE_KEY}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Type definitions matching the Supabase tables
export interface SupabaseRecipe {
  id: number;
  naslov: string;
  naslov_slike: string;
  slug: string;
  uzrast: string;
  tekstura: string;
  vremepripreme: string;
  vremekuvanja: string;
  ukupnovreme: string;
  sastojci: string;
  koraci: string;
  alergeni: string | null;
  nutritivnenapomene: string | null;
  gpt_nutri: string | null;
  kalorijepoobroku: string | null;
  slika: string;
  objavljeno: boolean;
}

export interface SupabaseRecipeTranslation {
  id: number;
  recipe_id: number;
  lang: string;
  naslov: string | null;
  sastojci: string | null;
  koraci: string | null;
  nutritivnenapomene: string | null;
  gpt_nutri: string | null;
}

export interface SupabasePremiumPlan {
  id: number;
  uzrast: string;
  dan: number;
  namirnice: string;
  extra1: string | null;
  extra2: string | null;
}
