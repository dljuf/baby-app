/**
 * Auth domain router.
 * Handles session introspection and logout.
 */
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { publicProcedure, router } from "../_core/trpc";

export const authRouter = router({
  /** Return the currently authenticated user, or null if unauthenticated. */
  me: publicProcedure.query((opts) => opts.ctx.user),

  /** Clear the session cookie and end the user's session. */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});
