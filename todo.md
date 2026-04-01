# Project TODO

## Completed
- [x] Basic app skeleton (Home, RecipeList, RecipeDetail, ShoppingList, Tips, Favorites, Settings)
- [x] Weekly meal plan feature
- [x] i18n system with 7 languages (sr, hr, en, de, it, es, fr)
- [x] Rename to TinyTasteSteps with slogan
- [x] Upgrade to full-stack (web-db-user)

## Supabase Integration
- [x] Resolve upgrade conflicts (Home.tsx, NotFound.tsx)
- [x] Add user's Supabase credentials as secrets
- [x] Create backend API routes for recipes from Supabase
- [x] Create backend API routes for premium_plan from Supabase
- [x] Update frontend to fetch recipes from API
- [x] Run db:push for Manus internal DB
- [x] Write vitest tests for API routes (13/13 passing)

## Bug Fixes
- [x] Fix recipe images not showing in preview (Supabase Image Transformations: 400px thumbnails, 800px detail)
- [x] Fix: "All Recipes" only shows 50 instead of all 200 recipes (limit increased to 200, always passed)

## Age Group Improvements
- [x] Group age filters into paired months (5-6, 7-8, 9-10, 11-12) on RecipeList page
- [x] Update Home page age icons to match grouped months
- [x] Update all 7 language files with new age group labels
- [x] Rearrange age filter buttons into 2-row grid on RecipeList for mobile visibility

## Recipe Translations (6 languages)
- [x] Create recipe_translations table in Supabase
- [x] Build AI batch translation script
- [x] Translate all 200 recipes to EN (US - imperial + metric)
- [x] Translate all 200 recipes to DE (German)
- [x] Translate all 200 recipes to FR (French) - 200/200 complete
- [x] Translate all 200 recipes to IT (Italian) - 200/200 complete
- [x] Translate all 200 recipes to ES (Spanish) - 200/200 complete
- [x] Translate all 200 recipes to HR (Croatian - manual mapping)
- [x] Update backend API to serve translated recipes by language
- [x] Update frontend to request recipes in current i18n language
- [x] Validate translations (same ingredient count, numbers preserved) - 18/18 tests passing, all 7 languages verified via API
