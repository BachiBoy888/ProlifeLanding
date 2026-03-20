import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'prolife_cookies_consent';

const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 z-[300] mx-auto max-w-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="rounded-xl border border-white/[0.1] bg-[#1A1D27] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
            <p className="text-sm text-[#A9B1BA] leading-relaxed mb-4">
              Мы используем файлы cookie для корректной работы сайта.{' '}
              <a
                href="#/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A90A4] hover:text-[#F4F6F8] underline underline-offset-2 transition-colors"
              >
                Политика конфиденциальности
              </a>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleChoice('accepted')}
                className="btn-primary flex-1 text-sm py-2"
              >
                Принять
              </button>
              <button
                onClick={() => handleChoice('declined')}
                className="btn-outline flex-1 text-sm py-2"
              >
                Отклонить
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiesBanner;
