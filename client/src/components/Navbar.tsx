import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';

type NavbarProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#home" className="group inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_24px_rgba(34,211,238,.65)]" />
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            ResumeAI Pro
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            Features
          </a>
          <a
            href="#ats-preview"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            ATS Preview
          </a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <a
            href="#upload"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:scale-[1.02] hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:shadow-white/20 dark:hover:bg-slate-200"
          >
            Upload Resume
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
