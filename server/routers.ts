/**
 * Root application router.
 * Composes all domain routers into a single tRPC router.
 * Domain logic lives in ./routers/* — this file only wires them together.
 */
import { router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { authRouter } from "./routers/authRouter";
import { recipesRouter } from "./routers/recipesRouter";
import { premiumPlanRouter } from "./routers/premiumPlanRouter";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  recipes: recipesRouter,
  premiumPlan: premiumPlanRouter,
});

export type AppRouter = typeof appRouter;
