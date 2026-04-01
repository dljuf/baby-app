// TinyTasteSteps - Bottom Navigation
// Design: Scandinavian Warmth - warm cream background, terracotta active state
import { Home, ShoppingCart, CalendarDays, Heart, Settings } from 'lucide-react';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const navItems = [
  { path: '/', labelKey: 'nav.home', icon: Home },
  { path: '/meal-plan', labelKey: 'nav.plan', icon: CalendarDays },
  { path: '/shopping', labelKey: 'nav.shopping', icon: ShoppingCart },
  { path: '/favorites', labelKey: 'nav.favorites', icon: Heart },
  { path: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const { shoppingCount, getMealPlanCount } = useApp();
  const { t } = useTranslation();

  // Don't show on recipe detail page
  if (location.startsWith('/recipe/')) return null;

  const mealPlanCount = getMealPlanCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border/50">
      <div className="max-w-[480px] mx-auto flex items-center justify-around px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = location === item.path || 
            (item.path !== '/' && location.startsWith(item.path));
          const isHome = item.path === '/' && location === '/';
          const active = isActive || isHome;

          const badgeCount = item.path === '/shopping' ? shoppingCount
            : item.path === '/meal-plan' ? mealPlanCount
            : 0;

          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 transition-colors"
            >
              <div className="relative">
                <item.icon
                  size={21}
                  className={`transition-colors ${
                    active ? 'text-terracotta' : 'text-warm-gray'
                  }`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {badgeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 bg-terracotta text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5"
                  >
                    {badgeCount}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-terracotta' : 'text-warm-gray'
                }`}
              >
                {t(item.labelKey)}
              </span>
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-terracotta rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
