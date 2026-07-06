import { motion } from 'framer-motion';
import { useRef } from 'react';

type UploadDropzoneProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

function UploadDropzone({ onFileSelect, disabled = false }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const openFilePicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className="group relative rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center transition hover:border-cyan-400 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:hover:border-cyan-400/70 dark:hover:bg-white/10"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        Drag & drop your resume here
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        or{' '}
        <button
          type="button"
          onClick={openFilePicker}
          className="font-semibold text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          click to browse
        </button>
      </p>
    </motion.div>
  );
}

export default UploadDropzone;
