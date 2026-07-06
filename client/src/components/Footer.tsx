function Footer() {
  return (
    <footer className="border-t border-slate-200/70 px-6 py-10 dark:border-white/10 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">ResumeAI Pro</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Professional AI guidance for high-impact resumes.
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm text-slate-600 dark:text-slate-300">
          <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">
            Features
          </a>
          <a href="#ats-preview" className="transition hover:text-slate-900 dark:hover:text-white">
            ATS Preview
          </a>
          <a href="#upload" className="transition hover:text-slate-900 dark:hover:text-white">
            Upload Resume
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
