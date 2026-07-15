import { useMemo, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

import FilePreview from '../components/upload/FilePreview';
import SupportedFormats from '../components/upload/SupportedFormats';
import UploadActions from '../components/upload/UploadActions';
import UploadCard from '../components/upload/UploadCard';
import UploadDropzone from '../components/upload/UploadDropzone';
import UploadError from '../components/upload/UploadError';
import UploadProgress from '../components/upload/UploadProgress';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const;

const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'The selected file is empty.')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be 10 MB or less.')
    .refine(
      (file) => allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number]),
      'Unsupported file format. Use PDF, DOCX, or TXT.',
    ),
});

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

type UploadResponse = {
  success: boolean;
  uploadId: string;
  filename: string;
  size: number;
};

type ParsedResume = {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  skills: string[];
  softSkills: string[];
  education: Array<Record<string, unknown>>;
  experience: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  certifications: Array<Record<string, unknown>>;
  languages: string[];
  achievements: string[];
  confidence: Record<string, number>;
};

type ParserErrorResponse = {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
};

type ParserSuccessResponse = {
  success: true;
  data: ParsedResume;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function UploadResumePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedAt, setUploadedAt] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseIssueType, setParseIssueType] = useState<
    'upload' | 'parser' | 'extraction' | 'normalization' | null
  >(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const extension = useMemo(() => {
    if (!selectedFile) return '';
    const parts = selectedFile.name.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() ?? '' : 'FILE';
  }, [selectedFile]);

  const validateFile = (file: File): boolean => {
    const result = uploadSchema.safeParse({ file });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid file.');
      setUploadStatus('error');
      return false;
    }

    setError(null);
    setUploadStatus('idle');
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
    setUploadedAt(null);
    setProgress(0);
    setParsedResume(null);
    setParseError(null);
    setParseIssueType(null);
    setShowRawJson(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setUploadedAt(null);
    setProgress(0);
    setError(null);
    setUploadStatus('idle');
    setParsedResume(null);
    setParseError(null);
    setParseIssueType(null);
    setShowRawJson(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file before uploading.');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post<UploadResponse>('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const nextProgress = Math.round((event.loaded * 100) / event.total);
          setProgress(nextProgress);
        },
      });

      setUploadResult(response.data);
      setUploadStatus('success');
      setUploadedAt(new Date().toLocaleString());
      setProgress(100);

      try {
        const parseResponse = await axios.post<ParserSuccessResponse | ParserErrorResponse>(
          '/api/v1/parser',
          { uploadId: response.data.uploadId },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if ('success' in parseResponse.data && parseResponse.data.success) {
          setParsedResume(parseResponse.data.data);
          setParseError(null);
          setParseIssueType(null);
          setShowRawJson(false);
        } else {
          setParsedResume(null);
          setParseError(
            parseResponse.data.error?.message ??
              parseResponse.data.message ??
              'Parser returned an unexpected error.',
          );
          setParseIssueType('parser');
        }
      } catch (parseErr) {
        const parserAxiosError = parseErr as AxiosError<ParserErrorResponse>;
        const code = parserAxiosError.response?.data?.error?.code;
        const message =
          parserAxiosError.response?.data?.error?.message ??
          parserAxiosError.response?.data?.message ??
          parserAxiosError.message ??
          'Parsing failed due to an unexpected error.';

        setParsedResume(null);
        setParseError(message);

        if (
          code === 'UPLOAD_NOT_FOUND' ||
          code === 'MISSING_UPLOAD_ID' ||
          code === 'UNSUPPORTED_FILE_TYPE'
        ) {
          setParseIssueType('upload');
        } else if (code === 'CORRUPTED_FILE' || code === 'EMPTY_RESUME') {
          setParseIssueType('parser');
        } else {
          setParseIssueType('extraction');
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        'Upload failed due to an unexpected error.';
      setError(message);
      setUploadStatus('error');
      setParseIssueType('upload');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-3xl dark:bg-cyan-500/20" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/20" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl space-y-6">
        <header className="glass-panel rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
            Resume Upload
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Upload your resume
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Drag and drop your resume file or browse from your computer. We validate format and size
            before preparing it for analysis.
          </p>
        </header>

        <UploadCard>
          <div className="space-y-6">
            <UploadDropzone onFileSelect={handleFileSelect} disabled={uploadStatus === 'uploading'} />

            <SupportedFormats maxSizeText="10 MB" formats={['PDF', 'DOCX', 'TXT']} />

            {uploadStatus === 'uploading' && <UploadProgress progress={progress} />}

            {error && <UploadError message={error} onRetry={selectedFile ? handleUpload : undefined} />}

            {selectedFile && (
              <FilePreview
                filename={selectedFile.name}
                extension={extension}
                size={formatBytes(selectedFile.size)}
                uploadTime={uploadedAt ?? 'Not uploaded yet'}
                onRemove={clearSelection}
                onReplace={clearSelection}
              />
            )}

            <UploadActions
              canUpload={Boolean(selectedFile) && uploadStatus !== 'uploading'}
              isUploading={uploadStatus === 'uploading'}
              isSuccess={uploadStatus === 'success'}
              onUpload={handleUpload}
              onReset={clearSelection}
            />
          </div>
        </UploadCard>
        {parseError && (
          <div className="glass-panel rounded-2xl border border-rose-400/30 p-4 text-sm text-rose-700 dark:text-rose-300">
            <p className="font-semibold">Parsing failed</p>
            <p className="mt-1">{parseError}</p>
            <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
              Issue Type: {parseIssueType ?? 'parser'}
            </p>
          </div>
        )}

        {parsedResume && (
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl border border-cyan-400/30 p-5">
              <h2 className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                Resume Parsed Successfully
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.personal.name || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.personal.email || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.personal.phone || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Skills</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.skills.length}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Education</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.education.length}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Experience</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.experience.length}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Projects</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.projects.length}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Certifications</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.certifications.length}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Languages</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.languages.length}</p>
                </div>
                <div className="rounded-xl border border-slate-300/60 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-900/40 sm:col-span-2 lg:col-span-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Achievements</p>
                  <p className="mt-1 text-sm font-medium">{parsedResume.achievements.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadResumePage;
