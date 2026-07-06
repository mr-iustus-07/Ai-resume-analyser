import { motion } from 'framer-motion';

const features = [
  {
    title: 'AI Analysis',
    description:
      'Get deep resume intelligence on clarity, impact, and role alignment with actionable recommendations.',
  },
  {
    title: 'ATS Optimization',
    description:
      'Improve keyword targeting, section structure, and machine readability to boost screening performance.',
  },
  {
    title: 'Writing Quality',
    description:
      'Strengthen bullets with measurable outcomes, sharper action verbs, and concise professional tone.',
  },
  {
    title: 'Career Positioning',
    description:
      'Highlight strengths that align your experience with target roles and hiring expectations.',
  },
];

function FeatureGrid() {
  return (
    <section id="features" className="px-6 py-20 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Professional feedback built for modern hiring
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Every analysis is structured to help you improve faster and present your best profile.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
              className="glass-panel rounded-3xl p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;
