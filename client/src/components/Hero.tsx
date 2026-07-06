import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-20 pt-20 lg:px-8 lg:pt-28">
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-300">
            AI-Powered Resume Intelligence
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Build a Resume That
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {' '}
              Gets Interviews
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            Analyze your resume with premium AI insights, optimize for ATS systems, and present your
            strengths with confidence using a modern, professional workflow.
          </p>

          <div id="upload" className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/upload"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/25 transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:shadow-white/20 dark:hover:bg-slate-200"
            >
              Analyze Resume
            </Link>
            <a
              href="#ats-preview"
              className="rounded-2xl border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
            >
              See ATS Preview
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="glass-panel relative rounded-3xl p-6 sm:p-8">
            <div className="absolute -top-6 left-10 h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400/70 to-blue-600/80 blur-xl" />
            <div className="absolute -bottom-8 right-8 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl" />

            <div className="relative space-y-4">
              <div className="rounded-2xl border border-white/20 bg-white/40 p-4 dark:bg-white/5">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Resume Score</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">88 / 100</p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/40 p-4 dark:bg-white/5">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">ATS Match</p>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">82% role compatibility</p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/40 p-4 dark:bg-white/5">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Suggested Improvements
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Add quantified achievements to experience bullets</li>
                  <li>• Include role-specific technical keywords</li>
                  <li>• Strengthen leadership and impact language</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
