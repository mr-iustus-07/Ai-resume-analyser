import { useEffect, useState } from 'react';

import ATSPreview from './components/ATSPreview';
import FeatureGrid from './components/FeatureGrid';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/30 blur-3xl dark:bg-cyan-500/20" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/20" />
      </div>

      <div className="relative z-10">
        <Navbar isDark={isDark} onToggleTheme={() => setIsDark((prev) => !prev)} />
        <main>
          <Hero />
          <FeatureGrid />
          <ATSPreview />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
