/**
 * Shared domain constants.
 * Single source of truth for business definitions used by both
 * the frontend and the backend.
 *
 * Rules:
 * - No UI-only data here (labels, flags, icons belong in the frontend).
 * - No backend-only data here (DB table names, query helpers belong in the server).
 * - Only structural identity values that both sides need to agree on.
 */

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

/**
 * All language codes supported by the app UI.
 * Serbian ('sr') is the original/source language and is always included.
 */
export const SUPPORTED_LANG_CODES = [
  'sr',
  'hr',
  'en',
  'de',
  'it',
  'es',
  'fr',
] as const;

export type SupportedLangCode = (typeof SUPPORTED_LANG_CODES)[number];

/**
 * Language codes that have translation rows in the database.
 * Serbian is intentionally excluded — it is the source language,
 * not stored as a translation row.
 */
export const TRANSLATABLE_LANG_CODES = SUPPORTED_LANG_CODES.filter(
  (c): c is Exclude<SupportedLangCode, 'sr'> => c !== 'sr'
);

// ---------------------------------------------------------------------------
// Age groups
// ---------------------------------------------------------------------------

/**
 * Age group definitions for recipe browsing.
 * Each group maps a display id to the raw month values stored in the database
 * and an emoji used in the UI.
 */
export const AGE_GROUPS = [
  { id: '5-6',  months: ['5',  '6'],  emoji: '👶' },
  { id: '7-8',  months: ['7',  '8'],  emoji: '🧒' },
  { id: '9-10', months: ['9',  '10'], emoji: '👧' },
  { id: '11-12',months: ['11', '12'], emoji: '🌟' },
] as const;

export type AgeGroupId = (typeof AGE_GROUPS)[number]['id'];

// ---------------------------------------------------------------------------
// Meal slots
// ---------------------------------------------------------------------------

/**
 * Canonical meal slot identifiers.
 * Used as keys in the weekly meal plan and as action payloads.
 */
export const MEAL_SLOT_IDS = ['dorucak', 'rucak', 'vecera'] as const;

export type MealSlotId = (typeof MEAL_SLOT_IDS)[number];
