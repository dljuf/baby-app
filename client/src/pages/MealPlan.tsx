// TinyTasteSteps - Meal Plan Page
// Design: Scandinavian Warmth - horizontal day tabs, vertical meal slots, warm organic cards
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useSearch } from 'wouter';
import { useState, useMemo, useEffect } from 'react';
import { Plus, X, ShoppingCart, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { useApp, daysOfWeek, mealSlots, type DayOfWeek, type MealSlot } from '@/contexts/AppContext';
import { MEAL_SLOT_IDS } from '@shared/domain';
import { useRecipeList, useRecipeById } from '@/hooks/useRecipes';
import RecipePicker from '@/components/RecipePicker';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

/** Small component to render a meal slot with its recipe */
function MealSlotCard({ recipeId, onRemove, onNavigate }: { recipeId: string; onRemove: () => void; onNavigate: (id: string) => void }) {
  const { recipe, isLoading } = useRecipeById(recipeId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="p-3 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onNavigate(recipe.id)}
        className="flex items-center gap-3 flex-1"
      >
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
          loading="lazy"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-warm-brown leading-snug">
            {recipe.name}
          </p>
          <p className="text-[11px] text-warm-gray mt-0.5">
            {recipe.age}+ {t('recipes.months')} &middot; {recipe.ingredients.length} {t('recipes.ingredientsLabel')}
          </p>
        </div>
        <ChevronRight size={16} className="text-warm-gray/40 shrink-0" />
      </button>
      <button
        onClick={onRemove}
        className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 hover:bg-destructive/20 transition-colors"
      >
        <X size={12} className="text-destructive" />
      </button>
    </div>
  );
}

export default function MealPlan() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { state, dispatch } = useApp();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('pon');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<MealSlot>('dorucak');
  const [pendingRecipe, setPendingRecipe] = useState<string | null>(null);
  const { t } = useTranslation();

  // Fetch all recipes for shopping list generation
  const { recipes: allRecipes } = useRecipeList();

  // Handle addRecipe query param from RecipeDetail
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const addRecipeId = params.get('addRecipe');
    if (addRecipeId) {
      setPendingRecipe(addRecipeId);
      const plan = state.mealPlan[selectedDay];
      const emptySlot = !plan.dorucak ? 'dorucak' : !plan.rucak ? 'rucak' : !plan.vecera ? 'vecera' : null;
      if (emptySlot) {
        setPickerSlot(emptySlot as MealSlot);
      }
      setPickerOpen(true);
      setLocation('/meal-plan', { replace: true });
    }
  }, []);

  const currentDayPlan = state.mealPlan[selectedDay];

  const dayMealCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const day of daysOfWeek) {
      const plan = state.mealPlan[day.id];
      let c = 0;
      if (plan.dorucak) c++;
      if (plan.rucak) c++;
      if (plan.vecera) c++;
      counts[day.id] = c;
    }
    return counts;
  }, [state.mealPlan]);

  const openPicker = (slot: MealSlot) => {
    setPickerSlot(slot);
    setPickerOpen(true);
  };

  const handleSelectRecipe = (recipeId: string) => {
    dispatch({ type: 'SET_MEAL', day: selectedDay, slot: pickerSlot, recipeId });
    toast.success(t('mealPlan.recipeAdded'));
  };

  const handleRemoveMeal = (slot: MealSlot) => {
    dispatch({ type: 'REMOVE_MEAL', day: selectedDay, slot });
  };

  const handleClearDay = () => {
    dispatch({ type: 'CLEAR_DAY', day: selectedDay });
    toast(t('mealPlan.dayCleared'), {
      description: t('mealPlan.dayClearedDesc', { day: t(`days.${selectedDay}`) }),
    });
  };

  const handleAddAllToShopping = () => {
    // Collect all recipe IDs from the meal plan
    const allIngredients: string[] = [];
    for (const day of Object.values(state.mealPlan)) {
      for (const slot of MEAL_SLOT_IDS) {
        const recipeId = day[slot];
        if (recipeId) {
          // Find recipe in fetched list (we only have list items, not full details)
          // For shopping list, we'll add the recipe name as a placeholder
          const recipe = allRecipes.find(r => r.id === recipeId);
          if (recipe) {
            allIngredients.push(recipe.name);
          }
        }
      }
    }
    if (allIngredients.length === 0) {
      toast(t('mealPlan.planEmpty'), { description: t('mealPlan.planEmptyDesc') });
      return;
    }
    const unique = Array.from(new Set(allIngredients));
    dispatch({ type: 'ADD_TO_SHOPPING_LIST', items: unique });
    toast.success(t('mealPlan.addedToShoppingFromPlan'), {
      description: t('mealPlan.addedToShoppingFromPlanDesc', { count: unique.length }),
    });
  };

  const totalMeals = Object.values(state.mealPlan).reduce((acc, day) => {
    let c = 0;
    if (day.dorucak) c++;
    if (day.rucak) c++;
    if (day.vecera) c++;
    return acc + c;
  }, 0);

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-warm-brown">
            {t('mealPlan.title')}
          </h1>
          <button
            onClick={handleAddAllToShopping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/15 text-sage text-xs font-medium hover:bg-sage/25 transition-colors"
          >
            <ShoppingCart size={14} />
            {t('mealPlan.shoppingList')}
          </button>
        </div>
        <p className="text-sm text-warm-gray mt-0.5">
          {t('mealPlan.subtitle')}
        </p>
      </div>

      {/* Day Tabs */}
      <div className="px-4 py-3">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {daysOfWeek.map((day) => {
            const isActive = selectedDay === day.id;
            const count = dayMealCount[day.id];
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`relative shrink-0 flex flex-col items-center px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'bg-white text-warm-brown border border-border hover:border-terracotta/30'
                }`}
              >
                <span className="text-xs font-semibold">{t(`daysShort.${day.id}`)}</span>
                {count > 0 && (
                  <div className={`mt-1 flex gap-0.5`}>
                    {Array.from({ length: count }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isActive ? 'bg-cream/70' : 'bg-terracotta/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-warm-brown">
          {t(`days.${selectedDay}`)}
        </h2>
        {dayMealCount[selectedDay] > 0 && (
          <button
            onClick={handleClearDay}
            className="flex items-center gap-1 text-xs text-warm-gray hover:text-destructive transition-colors"
          >
            <Trash2 size={12} />
            {t('mealPlan.clearDay')}
          </button>
        )}
      </div>

      {/* Meal Slots */}
      <div className="px-4 space-y-3 mb-6">
        {mealSlots.map((slot) => {
          const recipeId = currentDayPlan[slot.id];

          return (
            <motion.div
              key={slot.id}
              layout
              className="rounded-2xl overflow-hidden border border-border bg-white"
            >
              {/* Slot Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30">
                <span className="text-base">{slot.icon}</span>
                <span className="text-sm font-medium text-warm-brown">{t(`meals.${slot.id}`)}</span>
              </div>

              {/* Slot Content */}
              <AnimatePresence mode="wait">
                {recipeId ? (
                  <motion.div
                    key={recipeId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3"
                  >
                    <MealSlotCard
                      recipeId={recipeId}
                      onRemove={() => handleRemoveMeal(slot.id)}
                      onNavigate={(id) => setLocation(`/recipe/${id}`)}
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => openPicker(slot.id)}
                    className="w-full p-4 flex flex-col items-center gap-1.5 hover:bg-terracotta-light/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-terracotta/30 flex items-center justify-center">
                      <Plus size={18} className="text-terracotta/50" />
                    </div>
                    <span className="text-xs text-warm-gray">{t('mealPlan.addRecipe')}</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-sage/10 border border-sage/20 p-4">
          <h3 className="font-display text-sm font-semibold text-sage mb-2">
            {t('mealPlan.weeklyOverview')}
          </h3>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => {
              const plan = state.mealPlan[day.id];
              const slots = [plan.dorucak, plan.rucak, plan.vecera];
              return (
                <div key={day.id} className="text-center">
                  <p className={`text-[10px] font-medium mb-1 ${
                    selectedDay === day.id ? 'text-terracotta' : 'text-warm-gray'
                  }`}>
                    {t(`daysShort.${day.id}`)}
                  </p>
                  <div className="flex flex-col items-center gap-0.5">
                    {slots.map((s, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          s ? 'bg-sage/60' : 'bg-warm-gray/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-warm-gray mt-2 text-center">
            {t('mealPlan.mealsPlanned', { count: totalMeals })}
          </p>
        </div>
      </div>

      {/* Recipe Picker */}
      <RecipePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectRecipe}
        slotLabel={t(`meals.${pickerSlot}`)}
        dayLabel={t(`days.${selectedDay}`)}
      />
    </div>
  );
}
