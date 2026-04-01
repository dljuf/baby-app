// TinyTasteSteps - Recipe List Page
// Design: Scandinavian Warmth - grouped age filters, section headers, warm tones
import { motion } from 'framer-motion';
import { useLocation, useSearch } from 'wouter';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecipeList } from '@/hooks/useRecipes';

/** Age group definitions - paired months matching developmental stages */
const AGE_GROUPS: { id: string; months: string[]; emoji: string }[] = [
  { id: '5-6', months: ['5', '6'], emoji: '👶' },
  { id: '7-8', months: ['7', '8'], emoji: '🧒' },
  { id: '9-10', months: ['9', '10'], emoji: '👧' },
  { id: '11-12', months: ['11', '12'], emoji: '🌟' },
];

export default function RecipeList() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const ageParam = params.get('age') || 'all';
  const { t } = useTranslation();

  // Map incoming age param to a group id if it matches a single month
  const initialGroup = useMemo(() => {
    if (ageParam === 'all') return 'all';
    // Check if it's already a group id
    const directMatch = AGE_GROUPS.find(g => g.id === ageParam);
    if (directMatch) return directMatch.id;
    // Check if it's a single month that belongs to a group
    const groupMatch = AGE_GROUPS.find(g => g.months.includes(ageParam));
    return groupMatch ? groupMatch.id : 'all';
  }, [ageParam]);

  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup);

  // Fetch ALL recipes (no server-side age filter - we filter client-side by group)
  const { recipes: allRecipes, isLoading } = useRecipeList();

  // Filter recipes by selected age group on the client
  const filteredRecipes = useMemo(() => {
    if (selectedGroup === 'all') return allRecipes;
    const group = AGE_GROUPS.find(g => g.id === selectedGroup);
    if (!group) return allRecipes;
    return allRecipes.filter(r => group.months.includes(r.age));
  }, [allRecipes, selectedGroup]);

  // Group filtered recipes by age for section headers
  const groupedRecipes = useMemo(() => {
    if (selectedGroup === 'all') {
      // When "All" is selected, group by age group pairs
      return AGE_GROUPS.map(group => {
        const recipes = allRecipes.filter(r => group.months.includes(r.age));
        return {
          groupId: group.id,
          label: t(`ageGroups.${group.id}`),
          emoji: group.emoji,
          recipes,
        };
      }).filter(g => g.recipes.length > 0);
    } else {
      // When a specific group is selected, show as single section
      return [{
        groupId: selectedGroup,
        label: t(`ageGroups.${selectedGroup}`),
        emoji: AGE_GROUPS.find(g => g.id === selectedGroup)?.emoji || '🍽️',
        recipes: filteredRecipes,
      }];
    }
  }, [allRecipes, filteredRecipes, selectedGroup, t]);

  const totalFiltered = filteredRecipes.length;

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-1 text-terracotta font-medium text-sm"
          >
            <ChevronLeft size={20} />
            {t('recipes.back')}
          </button>
          <h1 className="font-display text-xl font-bold text-warm-brown flex-1 text-center pr-8">
            {t('categories.all')}
          </h1>
        </div>

        {/* Age Group Filter Pills - 2 row grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Row 1: All, 5-6, 7-8 */}
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              selectedGroup === 'all'
                ? 'bg-terracotta text-cream shadow-sm'
                : 'bg-white text-warm-brown border border-terracotta/20 hover:border-terracotta/40'
            }`}
          >
            <span>⭐</span>
            <span>{t('ageStages.all')}</span>
          </button>
          {AGE_GROUPS.slice(0, 2).map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(selectedGroup === group.id ? 'all' : group.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                selectedGroup === group.id
                  ? 'bg-terracotta text-cream shadow-sm'
                  : 'bg-white text-warm-brown border border-terracotta/20 hover:border-terracotta/40'
              }`}
            >
              <span>{group.emoji}</span>
              <span>{t(`ageGroups.${group.id}`)}</span>
            </button>
          ))}
          {/* Row 2: 9-10, 11-12 (centered) */}
          <div className="col-span-3 flex justify-center gap-2">
            {AGE_GROUPS.slice(2).map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(selectedGroup === group.id ? 'all' : group.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  selectedGroup === group.id
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'bg-white text-warm-brown border border-terracotta/20 hover:border-terracotta/40'
                }`}
              >
                <span>{group.emoji}</span>
                <span>{t(`ageGroups.${group.id}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-terracotta font-medium">
          {isLoading ? '...' : t('recipes.recipeCount', { count: totalFiltered })}
        </p>
      </div>

      {/* Recipe Grid - Grouped by age */}
      <div className="px-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          </div>
        ) : totalFiltered === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-5xl mb-4">🍽️</p>
            <p className="font-display text-lg text-warm-brown">{t('recipes.noRecipes')}</p>
            <p className="text-sm text-warm-gray mt-1">
              {t('recipes.tryOtherFilter')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groupedRecipes.map((section) => (
              <motion.div
                key={section.groupId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{section.emoji}</span>
                  <h2 className="font-display text-base font-semibold text-warm-brown">
                    {section.label}
                  </h2>
                  <span className="text-xs text-warm-gray bg-terracotta/10 px-2 py-0.5 rounded-full">
                    {section.recipes.length}
                  </span>
                </div>

                {/* Recipe Grid */}
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
                  }}
                >
                  {section.recipes.map((recipe) => (
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
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-cream/70 bg-warm-brown/30 px-1.5 py-0.5 rounded-full">
                            {recipe.age}+ {t('recipes.months')}
                          </span>
                          {recipe.texture && (
                            <span className="text-[10px] text-cream/70 bg-warm-brown/30 px-1.5 py-0.5 rounded-full">
                              {recipe.texture}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
