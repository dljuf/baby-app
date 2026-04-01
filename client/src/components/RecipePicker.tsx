// TinyTasteSteps - Recipe Picker Modal
// Design: Scandinavian Warmth - bottom sheet style picker with search
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecipeList } from '@/hooks/useRecipes';

interface RecipePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (recipeId: string) => void;
  slotLabel: string;
  dayLabel: string;
}

export default function RecipePicker({ open, onClose, onSelect, slotLabel, dayLabel }: RecipePickerProps) {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  // Fetch recipes from backend
  const { recipes, isLoading } = useRecipeList(
    search.trim() ? { search: search.trim() } : undefined
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-warm-brown/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-3xl max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-warm-gray/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-warm-brown">
                  {t('mealPlan.selectRecipe')}
                </h3>
                <p className="text-xs text-warm-gray">
                  {dayLabel} &middot; {slotLabel}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-warm-gray/10 flex items-center justify-center"
              >
                <X size={16} className="text-warm-gray" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-border">
                <Search size={16} className="text-warm-gray/50 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('mealPlan.searchRecipes')}
                  className="flex-1 bg-transparent text-sm text-warm-brown placeholder:text-warm-gray/40 outline-none"
                />
              </div>
            </div>

            {/* Recipe List */}
            <div className="flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                </div>
              ) : recipes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm text-warm-gray">{t('mealPlan.noResults')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recipes.map((recipe) => (
                    <motion.button
                      key={recipe.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelect(recipe.id);
                        onClose();
                        setSearch('');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-terracotta-light/30 transition-colors border border-transparent hover:border-terracotta/15"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-warm-brown leading-snug">
                          {recipe.name}
                        </p>
                        <p className="text-[11px] text-warm-gray mt-0.5">
                          {recipe.age}+ {t('recipes.months')} &middot; {recipe.texture}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
