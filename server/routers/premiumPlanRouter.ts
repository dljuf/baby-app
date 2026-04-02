/**
 * Premium plan domain router.
 * Handles the food introduction plan data (list and per-day lookup).
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { supabaseQuery, type SupabasePremiumPlan } from "../supabase";

export const premiumPlanRouter = router({
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
});
