import { motion } from 'framer-motion';

type ThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
};

function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex h-10 w-20 items-center rounded-full border border-white/20 bg-white/10 px-1 backdrop-blur-md transition hover:border-white/40 dark:border-white/20 dark:bg-white/10"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute left-1 top-1 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-lg"
        animate={{ x: isDark ? 40 : 0 }}
      />
      <span className="sr-only">{isDark ? 'Dark mode enabled' : 'Light mode enabled'}</span>
      <span className="z-10 ml-2 text-xs font-semibold text-slate-900">{isDark ? '🌙' : '☀️'}</span>
      <span className="z-10 ml-auto mr-2 text-xs font-semibold text-white">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

export default ThemeToggle;
