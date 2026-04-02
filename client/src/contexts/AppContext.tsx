import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { type MealSlotId } from '@shared/domain';

interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
}

/** Re-export so existing consumers of AppContext don't need a new import. */
export type MealSlot = MealSlotId;

export interface DayPlan {
  [key: string]: string | null;
  dorucak: string | null; // recipe id or null
  rucak: string | null;
  vecera: string | null;
}

export type DayOfWeek = 'pon' | 'uto' | 'sri' | 'cet' | 'pet' | 'sub' | 'ned';

export type WeeklyPlan = Record<DayOfWeek, DayPlan>;

export const daysOfWeek: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'pon', label: 'Ponedjeljak', short: 'Pon' },
  { id: 'uto', label: 'Utorak', short: 'Uto' },
  { id: 'sri', label: 'Srijeda', short: 'Sri' },
  { id: 'cet', label: 'Četvrtak', short: 'Čet' },
  { id: 'pet', label: 'Petak', short: 'Pet' },
  { id: 'sub', label: 'Subota', short: 'Sub' },
  { id: 'ned', label: 'Nedjelja', short: 'Ned' },
];

export const mealSlots: { id: MealSlot; label: string; icon: string }[] = [
  { id: 'dorucak', label: 'Doručak', icon: '🌅' },
  { id: 'rucak', label: 'Ručak', icon: '☀️' },
  { id: 'vecera', label: 'Večera', icon: '🌙' },
];

const emptyDay: DayPlan = { dorucak: null, rucak: null, vecera: null };

const emptyWeek: WeeklyPlan = {
  pon: { ...emptyDay },
  uto: { ...emptyDay },
  sri: { ...emptyDay },
  cet: { ...emptyDay },
  pet: { ...emptyDay },
  sub: { ...emptyDay },
  ned: { ...emptyDay },
};

interface AppState {
  favorites: string[];
  shoppingList: ShoppingItem[];
  mealPlan: WeeklyPlan;
}

type AppAction =
  | { type: 'TOGGLE_FAVORITE'; recipeId: string }
  | { type: 'ADD_TO_SHOPPING_LIST'; items: string[] }
  | { type: 'ADD_CUSTOM_ITEM'; text: string }
  | { type: 'TOGGLE_SHOPPING_ITEM'; id: string }
  | { type: 'REMOVE_SHOPPING_ITEM'; id: string }
  | { type: 'CLEAR_CHECKED_ITEMS' }
  | { type: 'SET_MEAL'; day: DayOfWeek; slot: MealSlot; recipeId: string }
  | { type: 'REMOVE_MEAL'; day: DayOfWeek; slot: MealSlot }
  | { type: 'CLEAR_DAY'; day: DayOfWeek }
  | { type: 'CLEAR_WEEK' };

const initialState: AppState = {
  favorites: [],
  shoppingList: [],
  mealPlan: { ...emptyWeek },
};

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('tinytastesteps-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure mealPlan exists for backward compatibility
      if (!parsed.mealPlan) {
        parsed.mealPlan = { ...emptyWeek };
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return initialState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem('tinytastesteps-state', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.recipeId);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter((id) => id !== action.recipeId)
          : [...state.favorites, action.recipeId],
      };
    }
    case 'ADD_TO_SHOPPING_LIST': {
      const newItems: ShoppingItem[] = action.items
        .filter((text) => !state.shoppingList.some((item) => item.text === text))
        .map((text) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          text,
          checked: false,
        }));
      return {
        ...state,
        shoppingList: [...state.shoppingList, ...newItems],
      };
    }
    case 'ADD_CUSTOM_ITEM': {
      if (!action.text.trim()) return state;
      return {
        ...state,
        shoppingList: [
          ...state.shoppingList,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            text: action.text.trim(),
            checked: false,
          },
        ],
      };
    }
    case 'TOGGLE_SHOPPING_ITEM': {
      return {
        ...state,
        shoppingList: state.shoppingList.map((item) =>
          item.id === action.id ? { ...item, checked: !item.checked } : item
        ),
      };
    }
    case 'REMOVE_SHOPPING_ITEM': {
      return {
        ...state,
        shoppingList: state.shoppingList.filter((item) => item.id !== action.id),
      };
    }
    case 'CLEAR_CHECKED_ITEMS': {
      return {
        ...state,
        shoppingList: state.shoppingList.filter((item) => !item.checked),
      };
    }
    case 'SET_MEAL': {
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.day]: {
            ...state.mealPlan[action.day],
            [action.slot]: action.recipeId,
          },
        },
      };
    }
    case 'REMOVE_MEAL': {
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.day]: {
            ...state.mealPlan[action.day],
            [action.slot]: null,
          },
        },
      };
    }
    case 'CLEAR_DAY': {
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.day]: { ...emptyDay },
        },
      };
    }
    case 'CLEAR_WEEK': {
      return {
        ...state,
        mealPlan: { ...emptyWeek },
      };
    }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isFavorite: (recipeId: string) => boolean;
  shoppingCount: number;
  getMealPlanCount: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const isFavorite = (recipeId: string) => state.favorites.includes(recipeId);
  const shoppingCount = state.shoppingList.filter((item) => !item.checked).length;

  const getMealPlanCount = () => {
    let count = 0;
    for (const day of Object.values(state.mealPlan)) {
      if (day.dorucak) count++;
      if (day.rucak) count++;
      if (day.vecera) count++;
    }
    return count;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, isFavorite, shoppingCount, getMealPlanCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
