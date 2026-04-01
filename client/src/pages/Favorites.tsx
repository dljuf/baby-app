// TinyTasteSteps - Favorites Page
// Design: Scandinavian Warmth - warm empty state, recipe grid
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { useRecipeList } from '@/hooks/useRecipes';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { state } = useApp();
  const { t } = useTranslation();

  // Fetch all recipes and filter by favorites on client side
  const { recipes, isLoading } = useRecipeList();

  const favoriteRecipes = useMemo(() => {
    return recipes.filter((r) => state.favorites.includes(r.id));
  }, [recipes, state.favorites]);

  return (
    <div className="pb-safe">
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-warm-brown text-center">
          {t('favorites.title')}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
        </div>
      ) : favoriteRecipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 px-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-terracotta-light flex items-center justify-center">
            <span className="text-4xl">💝</span>
          </div>
          <p className="font-display text-lg text-warm-brown mb-2">
            {t('favorites.emptyTitle')}
          </p>
          <p className="text-sm text-warm-gray leading-relaxed">
            {t('favorites.emptyDesc')}
          </p>
          <button
            onClick={() => setLocation('/recipes')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-terracotta text-cream font-medium text-sm"
          >
            {t('favorites.browseRecipes')}
          </button>
        </motion.div>
      ) : (
        <div className="px-4">
          <p className="text-sm text-terracotta font-medium mb-3">
            {t('recipes.recipeCount', { count: favoriteRecipes.length })}
          </p>
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
          >
            {favoriteRecipes.map((recipe) => (
              <motion.button
                key={recipe.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                onClick={() => setLocation(`/recipe/${recipe.id}`)}
                className="relative rounded-xl overflow-hidden shadow-sm group"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/80 via-warm-brown/20 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-3">
                  <span className="text-cream font-display font-semibold text-sm leading-tight drop-shadow-md text-left">
                    {recipe.name}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
