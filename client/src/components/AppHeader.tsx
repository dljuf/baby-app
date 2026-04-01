// TinyTasteSteps - App Header
// Design: Scandinavian Warmth - minimal warm header with handwritten logo
// Brand name "TinyTasteSteps" stays untranslated for brand consistency
import { motion } from 'framer-motion';

export default function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-1"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">👶</span>
        <h1 className="font-handwritten text-2xl text-terracotta font-bold tracking-wide">
          TinyTasteSteps
        </h1>
      </div>
    </motion.header>
  );
}
