type UploadActionsProps = {
  canUpload: boolean;
  isUploading: boolean;
  isSuccess: boolean;
  onUpload: () => void;
  onReset: () => void;
};

function UploadActions({
  canUpload,
  isUploading,
  isSuccess,
  onUpload,
  onReset,
}: UploadActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onUpload}
        disabled={!canUpload}
        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:shadow-white/20 dark:hover:bg-slate-200"
      >
        {isUploading ? 'Uploading...' : isSuccess ? 'Uploaded' : 'Upload Resume'}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
      >
        Reset
      </button>
    </div>
  );
}

export default UploadActions;
