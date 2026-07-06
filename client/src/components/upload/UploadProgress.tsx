type UploadProgressProps = {
  progress: number;
};

function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium text-slate-700 dark:text-slate-200">Uploading resume...</p>
        <span className="text-slate-600 dark:text-slate-300">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

export default UploadProgress;
