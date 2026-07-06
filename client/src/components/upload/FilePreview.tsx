type FilePreviewProps = {
  filename: string;
  extension: string;
  size: string;
  uploadTime: string;
  onRemove: () => void;
  onReplace: () => void;
};

function FilePreview({
  filename,
  extension,
  size,
  uploadTime,
  onRemove,
  onReplace,
}: FilePreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/15 dark:bg-white/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">
            File Preview
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{filename}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {extension} · {size}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Upload time: {uploadTime}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReplace}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/40 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
