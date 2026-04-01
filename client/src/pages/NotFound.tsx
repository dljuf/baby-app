// TinyTasteSteps - 404 Page
// Design: Scandinavian Warmth - consistent with app theme
import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center">
        <p className="text-6xl mb-4">🍽️</p>
        <h1 className="font-display text-3xl font-bold text-warm-brown mb-2">404</h1>
        <h2 className="font-display text-lg font-semibold text-warm-brown mb-3">
          {t('notFound.title')}
        </h2>
        <p className="text-sm text-warm-gray leading-relaxed mb-6 max-w-xs mx-auto">
          {t('notFound.description')}
        </p>
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta text-cream font-medium text-sm shadow-sm hover:shadow-md transition-shadow"
        >
          <Home className="w-4 h-4" />
          {t('notFound.goHome')}
        </button>
      </div>
    </div>
  );
}
