// TinyTasteSteps - Recipe Detail Page
// Design: Scandinavian Warmth - hero image, warm tags, organic layout
import { motion } from 'framer-motion';
import { useLocation, useParams } from 'wouter';
import { ChevronLeft, Share2, Heart, Check, CalendarDays, Loader2, Clock, Flame } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useRecipeById } from '@/hooks/useRecipes';

export default function RecipeDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { dispatch, isFavorite } = useApp();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const { t } = useTranslation();

  const { recipe, isLoading } = useRecipeById(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-display text-lg text-warm-brown">{t('recipes.recipeNotFound')}</p>
          <button
            onClick={() => setLocation('/')}
            className="mt-4 text-terracotta font-medium"
          >
            {t('recipes.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(recipe.id);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addToShoppingList = () => {
    const selectedItems = checkedIngredients.size > 0
      ? recipe.ingredients.filter((_, i) => checkedIngredients.has(i))
      : recipe.ingredients;

    dispatch({ type: 'ADD_TO_SHOPPING_LIST', items: selectedItems });
    toast.success(t('recipes.addedToShopping'), {
      description: t('recipes.addedToShoppingDesc'),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream"
    >
      {/* Hero Image */}
      <div className="relative h-[280px]">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-brown/40 via-transparent to-transparent" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-cream font-medium text-sm bg-warm-brown/30 backdrop-blur-sm rounded-full px-3 py-1.5"
          >
            <ChevronLeft size={18} />
            {t('recipes.back')}
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-warm-brown/30 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={16} className="text-cream" />
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', recipeId: recipe.id })}
              className="w-9 h-9 rounded-full bg-warm-brown/30 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart
                size={16}
                className={favorite ? 'text-terracotta fill-terracotta' : 'text-cream'}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 bg-cream rounded-t-3xl px-5 pt-5 pb-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-sage text-cream text-xs font-medium">
            {recipe.age}+ {t('recipes.months')}
          </span>
          {recipe.texture && (
            <span className="px-3 py-1 rounded-full bg-terracotta-light text-warm-brown text-xs font-medium">
              {recipe.texture}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl font-bold text-warm-brown mb-3 leading-tight">
          {recipe.name}
        </h1>

        {/* Time & Calories Info */}
        <div className="flex items-center gap-4 mb-4">
          {recipe.prepTime && (
            <div className="flex items-center gap-1.5 text-warm-gray text-sm">
              <Clock size={14} className="text-sage" />
              <span>{t('recipes.prep')}: {recipe.prepTime} min</span>
            </div>
          )}
          {recipe.totalTime && (
            <div className="flex items-center gap-1.5 text-warm-gray text-sm">
              <Clock size={14} className="text-terracotta" />
              <span>{t('recipes.total')}: {recipe.totalTime} min</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center gap-1.5 text-warm-gray text-sm">
              <Flame size={14} className="text-butter-dark" />
              <span>{recipe.calories} kcal</span>
            </div>
          )}
        </div>

        {/* Nutrition Notes */}
        {recipe.nutritionNotes && (
          <div className="mb-4 p-3 rounded-xl bg-sage/10 border border-sage/20">
            <p className="text-xs font-medium text-sage mb-1">{t('recipes.nutritionNotes')}</p>
            <p className="text-xs text-warm-gray leading-relaxed">{recipe.nutritionNotes}</p>
          </div>
        )}

        {/* Ingredients */}
        <h2 className="font-display text-lg font-semibold text-warm-brown mb-3">{t('recipes.ingredients')}</h2>
        <div className="space-y-2.5 mb-4">
          {recipe.ingredients.map((ingredient, i) => (
            <button
              key={i}
              onClick={() => toggleIngredient(i)}
              className="flex items-center gap-3 w-full text-left"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  checkedIngredients.has(i)
                    ? 'bg-sage border-sage'
                    : 'border-warm-gray/30'
                }`}
              >
                {checkedIngredients.has(i) && <Check size={12} className="text-cream" />}
              </div>
              <span
                className={`text-sm transition-all ${
                  checkedIngredients.has(i)
                    ? 'text-warm-gray/50 line-through'
                    : 'text-warm-brown'
                }`}
              >
                {ingredient}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addToShoppingList}
            className="flex-1 py-3 rounded-xl bg-sage text-cream font-medium text-sm shadow-sm hover:shadow-md transition-shadow"
          >
            {t('recipes.addToShopping')}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setLocation(`/meal-plan?addRecipe=${recipe.id}`);
            }}
            className="py-3 px-4 rounded-xl bg-terracotta text-cream font-medium text-sm shadow-sm hover:shadow-md transition-shadow flex items-center gap-1.5"
          >
            <CalendarDays size={16} />
            {t('recipes.addToPlan')}
          </motion.button>
        </div>

        {/* Preparation Steps */}
        <h2 className="font-display text-lg font-semibold text-warm-brown mb-3">{t('recipes.preparation')}</h2>
        <div className="space-y-3 mb-5">
          {recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-terracotta">{i + 1}</span>
              </div>
              <p className="text-warm-gray text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        {/* Allergens */}
        {recipe.allergens && (
          <div className="mb-4 p-3 rounded-xl bg-terracotta/5 border border-terracotta/15">
            <p className="text-xs font-medium text-terracotta mb-1">{t('recipes.allergens')}</p>
            <p className="text-xs text-warm-gray leading-relaxed">{recipe.allergens}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
