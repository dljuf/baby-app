// TinyTasteSteps - Home Page
// Design: Scandinavian Warmth - organic shapes, warm tones, shelf-like layout
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { categories, categoryImages, heroBannerUrl } from '@/lib/data';
import { AGE_GROUPS } from '@shared/domain';
import { ChevronRight, Share2 } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Age stage entries for the home screen icon row.
// AGE_GROUPS provides the four named groups; the 'all' entry is appended here
// because it is a UI-only concept (not a real age group in the data model).
const ageStageEntries = [
  ...AGE_GROUPS,
  { id: 'all', months: [] as string[], emoji: '⭐' },
] as const;

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const { t } = useTranslation();

  const tipBannerData = [
    {
      title: t('banners.banana_title'),
      image: heroBannerUrl,
      points: [
        t('banners.banana_1'),
        t('banners.banana_2'),
        t('banners.banana_3'),
        t('banners.banana_4'),
      ],
    },
    {
      title: t('banners.carrot_title'),
      image: categoryImages.rucak,
      points: [
        t('banners.carrot_1'),
        t('banners.carrot_2'),
        t('banners.carrot_3'),
        t('banners.carrot_4'),
      ],
    },
  ];

  const tipColors: Record<string, string> = {
    sage: 'bg-sage-light border-sage/30',
    terracotta: 'bg-terracotta-light border-terracotta/30',
    butter: 'bg-butter border-butter-dark/30',
    warm: 'bg-cream border-warm-gray/20',
  };

  const tipKeys = [1, 2, 3, 4, 5, 6, 7];
  const tipColorOrder = ['sage', 'terracotta', 'butter', 'warm', 'sage', 'terracotta', 'butter'];

  return (
    <div className="pb-safe">
      <AppHeader />

      {/* Age Stage Icons */}
      <motion.div
        className="flex justify-center gap-4 pt-4 pb-3"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {ageStageEntries.map((entry) => (
          <motion.button
            key={entry.id}
            variants={fadeUp}
            onClick={() => setLocation(entry.id === 'all' ? '/recipes' : `/recipes?age=${entry.id}`)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 rounded-full bg-cream border-2 border-terracotta/20 flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-shadow hover:border-terracotta/40">
              {entry.emoji}
            </div>
            <span className="text-[11px] font-medium text-warm-brown">
              {entry.id === 'all' ? t('ageStages.all') : t(`ageGroups.${entry.id}`)}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Featured Banner */}
      <motion.div
        className="px-4 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-[200px]">
          <img
            src={tipBannerData[currentBanner].image}
            alt={tipBannerData[currentBanner].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/80 via-warm-brown/60 to-transparent" />
          <div className="relative h-full flex flex-col justify-between p-4">
            <div className="flex justify-between items-start">
              <h2 className="font-display text-2xl text-cream font-bold">
                {tipBannerData[currentBanner].title}
              </h2>
              <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Share2 size={14} className="text-cream" />
              </button>
            </div>
            <div className="space-y-1.5">
              {tipBannerData[currentBanner].points.slice(0, 3).map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-butter mt-1.5 shrink-0" />
                  <p className="text-cream/90 text-xs leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Banner dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {tipBannerData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentBanner ? 'bg-cream w-4' : 'bg-cream/40'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="px-4 mb-6">
        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              variants={fadeUp}
              onClick={() =>
                setLocation(cat.id === 'all' ? '/recipes' : `/recipes?cat=${cat.id}`)
              }
              className="relative rounded-xl overflow-hidden h-[100px] group shadow-sm"
            >
              <img
                src={categoryImages[cat.id] || categoryImages.all}
                alt={t(`categories.${cat.id}`)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/70 via-warm-brown/30 to-transparent" />
              <div className="relative h-full flex items-end p-3">
                <span className="text-cream font-display font-bold text-lg leading-tight drop-shadow-md">
                  {t(`categories.${cat.id}`)}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Quick Tips Preview */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold text-warm-brown">
            {t('home.quickTips')}
          </h3>
          <button
            onClick={() => setLocation('/tips')}
            className="flex items-center gap-1 text-terracotta text-sm font-medium"
          >
            {t('home.allTips')} <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {tipKeys.slice(0, 3).map((tipNum, i) => (
            <motion.div
              key={tipNum}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`shrink-0 w-[200px] rounded-xl p-3.5 border ${tipColors[tipColorOrder[i]]}`}
            >
              <h4 className="font-display text-sm font-semibold text-warm-brown mb-1.5 line-clamp-1">
                {t(`tips.tip${tipNum}_title`)}
              </h4>
              <p className="text-xs text-warm-gray leading-relaxed line-clamp-3">
                {t(`tips.tip${tipNum}_content`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* App branding */}
      <div className="px-4 pb-4 text-center">
        <p className="font-handwritten text-lg text-terracotta/60">TinyTasteSteps</p>
        <p className="text-[10px] text-warm-gray/50 mt-0.5">{t('app.tagline')}</p>
      </div>
    </div>
  );
}
