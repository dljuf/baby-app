// TinyTasteSteps - Tips/Savjeti Page
// Design: Scandinavian Warmth - colored cards, organic layout
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const colorMap = {
  sage: {
    bg: 'bg-sage/20',
    border: 'border-sage/30',
    title: 'text-sage',
  },
  terracotta: {
    bg: 'bg-terracotta/15',
    border: 'border-terracotta/25',
    title: 'text-terracotta',
  },
  butter: {
    bg: 'bg-butter',
    border: 'border-butter-dark/25',
    title: 'text-butter-dark',
  },
  warm: {
    bg: 'bg-terracotta-light',
    border: 'border-terracotta/20',
    title: 'text-warm-brown',
  },
};

const tipItems = [
  { num: 1, color: 'sage' as const },
  { num: 2, color: 'terracotta' as const },
  { num: 3, color: 'butter' as const },
  { num: 4, color: 'warm' as const },
  { num: 5, color: 'sage' as const },
  { num: 6, color: 'terracotta' as const },
  { num: 7, color: 'butter' as const },
];

export default function Tips() {
  const { t } = useTranslation();

  return (
    <div className="pb-safe">
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-warm-brown text-center">
          {t('tips.title')}
        </h1>
        <p className="text-center text-sm text-warm-gray mt-1">
          {t('tips.subtitle')}
        </p>
      </div>

      <div className="px-4 space-y-3">
        {tipItems.map((tip, i) => {
          const colors = colorMap[tip.color];
          return (
            <motion.div
              key={tip.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-5 border ${colors.bg} ${colors.border}`}
            >
              <h3 className={`font-display text-lg font-bold mb-2 ${colors.title}`}>
                {t(`tips.tip${tip.num}_title`)}
              </h3>
              <p className="text-warm-brown/80 text-sm leading-relaxed">
                {t(`tips.tip${tip.num}_content`)}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="px-4 py-6 text-center">
        <p className="font-handwritten text-lg text-terracotta/50">
          {t('tips.moreSoon')}
        </p>
      </div>
    </div>
  );
}
