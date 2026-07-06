type SupportedFormatsProps = {
  formats: string[];
  maxSizeText: string;
};

function SupportedFormats({ formats, maxSizeText }: SupportedFormatsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/15 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
        Supported formats
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {formats.map((format) => (
          <span
            key={format}
            className="rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-300"
          >
            {format}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Maximum file size: {maxSizeText}</p>
    </div>
  );
}

export default SupportedFormats;
