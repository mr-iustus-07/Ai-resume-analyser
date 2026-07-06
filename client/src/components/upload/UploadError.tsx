type UploadErrorProps = {
  message: string;
  onRetry?: () => void;
};

function UploadError({ message, onRetry }: UploadErrorProps) {
  return (
    <div className="rounded-2xl border border-rose-300 bg-rose-50/80 p-4 dark:border-rose-400/40 dark:bg-rose-500/10">
      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
        >
          Retry upload
        </button>
      )}
    </div>
  );
}

export default UploadError;
