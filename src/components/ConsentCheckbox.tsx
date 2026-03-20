import { motion, AnimatePresence } from 'motion/react';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

const ConsentCheckbox = ({ checked, onChange, error }: ConsentCheckboxProps) => (
  <div className="space-y-1">
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded"
        style={{ accentColor: '#4A90A4' }}
      />
      <span className="text-xs text-[#A9B1BA] leading-relaxed select-none">
        Я даю согласие на{' '}
        <a
          href="#/privacy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[#4A90A4] hover:text-[#F4F6F8] underline underline-offset-2 transition-colors"
        >
          обработку персональных данных
        </a>
      </span>
    </label>
    <AnimatePresence>
      {error && (
        <motion.p
          className="pl-6 text-xs text-red-400"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default ConsentCheckbox;
