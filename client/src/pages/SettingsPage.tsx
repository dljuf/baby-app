// TinyTasteSteps - Settings Page
// Design: Scandinavian Warmth - clean list layout with language selector
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, Moon, Globe, Info, MessageCircle, Star, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '@/lib/i18n';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangPicker(false);
    const lang = languages.find((l) => l.code === code);
    toast.success(t('settings.languageChanged'), {
      description: lang?.label,
    });
  };

  const handleAction = (action: string) => {
    if (action === 'language') {
      setShowLangPicker(true);
      return;
    }
    toast(t('settings.comingSoon'), {
      description: t('settings.comingSoonDesc'),
    });
  };

  const settingsGroups = [
    {
      titleKey: 'settings.general',
      items: [
        { icon: Bell, labelKey: 'settings.notifications', action: 'notifications' },
        { icon: Moon, labelKey: 'settings.darkMode', action: 'darkmode' },
        { icon: Globe, labelKey: 'settings.language', action: 'language', detail: `${currentLang.flag} ${currentLang.label}` },
      ],
    },
    {
      titleKey: 'settings.support',
      items: [
        { icon: Star, labelKey: 'settings.rateApp', action: 'rate' },
        { icon: MessageCircle, labelKey: 'settings.feedback', action: 'feedback' },
        { icon: Info, labelKey: 'settings.about', action: 'about' },
      ],
    },
  ];

  return (
    <div className="pb-safe">
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-warm-brown text-center">
          {t('settings.title')}
        </h1>
      </div>

      <div className="px-4 space-y-6">
        {settingsGroups.map((group, gi) => (
          <motion.div
            key={group.titleKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <h3 className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-2 px-1">
              {t(group.titleKey)}
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {group.items.map((item, i) => (
                <button
                  key={item.action}
                  onClick={() => handleAction(item.action)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-cream/50 transition-colors"
                  style={{
                    borderBottom: i < group.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-terracotta-light flex items-center justify-center">
                    <item.icon size={16} className="text-terracotta" />
                  </div>
                  <span className="flex-1 text-sm text-warm-brown text-left">{t(item.labelKey)}</span>
                  {item.detail && (
                    <span className="text-xs text-warm-gray mr-1">{item.detail}</span>
                  )}
                  <ChevronRight size={16} className="text-warm-gray/40" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-6"
        >
          <p className="font-handwritten text-2xl text-terracotta mb-1">TinyTasteSteps</p>
          <p className="text-xs text-warm-gray">{t('settings.version')} 1.0.0</p>
          <p className="text-xs text-warm-gray/60 mt-1">{t('settings.madeWithLove')}</p>
        </motion.div>
      </div>

      {/* Language Picker Bottom Sheet */}
      <AnimatePresence>
        {showLangPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLangPicker(false)}
              className="fixed inset-0 z-50 bg-warm-brown/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-3xl"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-warm-gray/20" />
              </div>

              {/* Header */}
              <div className="px-5 pb-3">
                <h3 className="font-display text-lg font-bold text-warm-brown">
                  {t('settings.selectLanguage')}
                </h3>
              </div>

              {/* Language List */}
              <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <div className="space-y-1">
                  {languages.map((lang) => {
                    const isActive = i18n.language === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChangeLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-terracotta/10 border border-terracotta/20'
                            : 'bg-white hover:bg-terracotta-light/20 border border-transparent'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className={`flex-1 text-sm text-left font-medium ${
                          isActive ? 'text-terracotta' : 'text-warm-brown'
                        }`}>
                          {lang.label}
                        </span>
                        {isActive && (
                          <div className="w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
                            <Check size={14} className="text-cream" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
