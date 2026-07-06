import { motion } from 'framer-motion';

function ATSPreview() {
  return (
    <section id="ats-preview" className="px-6 py-20 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass-panel grid gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_.95fr]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
              ATS Preview
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              See exactly how hiring systems evaluate your resume
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Get clear insights into keyword match, section quality, and formatting signals that impact
              interview chances.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-200">Keyword Match</span>
                  <span className="font-semibold text-slate-900 dark:text-white">84%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-200">Format Compliance</span>
                  <span className="font-semibold text-slate-900 dark:text-white">91%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-200">Impact Language</span>
                  <span className="font-semibold text-slate-900 dark:text-white">77%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full w-[77%] rounded-full bg-gradient-to-r from-violet-400 to-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Sample ATS Score</p>
            <div className="mt-5 flex items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-cyan-400/80 bg-slate-50 dark:bg-slate-900">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">86</span>
                <span className="absolute bottom-8 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-300">
                  out of 100
                </span>
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• Strong title and summary alignment</li>
              <li>• Add 2-3 job-specific technical skills</li>
              <li>• Quantify project outcomes more consistently</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ATSPreview;
