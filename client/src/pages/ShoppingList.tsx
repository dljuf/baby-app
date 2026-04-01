// TinyTasteSteps - Shopping List Page
// Design: Scandinavian Warmth - gradient background, organic checkboxes
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Plus, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ShoppingList() {
  const { state, dispatch } = useApp();
  const [newItem, setNewItem] = useState('');
  const { t } = useTranslation();

  const addItem = () => {
    if (newItem.trim()) {
      dispatch({ type: 'ADD_CUSTOM_ITEM', text: newItem });
      setNewItem('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addItem();
  };

  const uncheckedItems = state.shoppingList.filter((item) => !item.checked);
  const checkedItems = state.shoppingList.filter((item) => item.checked);

  return (
    <div className="min-h-screen pb-safe" style={{
      background: 'linear-gradient(180deg, #e8ddd4 0%, #f0e6d3 30%, #f5e6c8 70%, #f0ddb8 100%)',
    }}>
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl font-bold text-warm-brown text-center">
          {t('shopping.title')}
        </h1>
      </div>

      {/* Add Item Input */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('shopping.addPlaceholder')}
            className="flex-1 bg-transparent text-warm-brown placeholder:text-warm-gray/50 text-sm outline-none"
          />
          <button
            onClick={addItem}
            className="w-8 h-8 rounded-full bg-sage/80 flex items-center justify-center shrink-0"
          >
            <Plus size={16} className="text-cream" />
          </button>
        </div>
      </div>

      {/* Shopping Items */}
      <div className="px-4">
        {state.shoppingList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">🛒</p>
            <p className="font-display text-lg text-warm-brown">{t('shopping.emptyTitle')}</p>
            <p className="text-sm text-warm-gray mt-1">
              {t('shopping.emptyDesc')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {uncheckedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="flex items-center gap-3 py-3 border-b border-warm-brown/10"
                >
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_SHOPPING_ITEM', id: item.id })}
                    className="w-6 h-6 rounded-full border-2 border-warm-gray/30 flex items-center justify-center shrink-0 hover:border-sage transition-colors"
                  />
                  <span className="text-warm-brown text-sm flex-1">{item.text}</span>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_SHOPPING_ITEM', id: item.id })}
                    className="w-6 h-6 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} className="text-warm-gray" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Checked Items */}
            {checkedItems.length > 0 && (
              <>
                <div className="flex items-center justify-between pt-4 pb-2">
                  <span className="text-xs text-warm-gray/60 font-medium uppercase tracking-wide">
                    {t('shopping.bought')} ({checkedItems.length})
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'CLEAR_CHECKED_ITEMS' })}
                    className="text-xs text-terracotta/70 font-medium hover:text-terracotta transition-colors"
                  >
                    {t('shopping.clearBought')}
                  </button>
                </div>
                <AnimatePresence mode="popLayout">
                  {checkedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 py-3 border-b border-warm-brown/5"
                    >
                      <button
                        onClick={() => dispatch({ type: 'TOGGLE_SHOPPING_ITEM', id: item.id })}
                        className="w-6 h-6 rounded-full bg-sage/60 flex items-center justify-center shrink-0"
                      >
                        <Check size={12} className="text-cream" />
                      </button>
                      <span className="text-warm-gray/60 text-sm flex-1 line-through">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
