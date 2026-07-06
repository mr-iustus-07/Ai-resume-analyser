import { randomUUID } from 'node:crypto';

type UploadFile = {
  originalname: string;
  mimetype: string;
  size: number;
};

type UploadResult = {
  success: true;
  uploadId: string;
  filename: string;
  size: number;
};

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set<string>([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

export const validateUploadFile = (file?: UploadFile): UploadFile => {
  if (!file) {
    throw new UploadValidationError('No file provided. Please attach a resume file.');
  }

  if (file.size <= 0) {
    throw new UploadValidationError('Uploaded file is empty.');
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new UploadValidationError('File size exceeds 10 MB limit.');
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new UploadValidationError('Unsupported file format. Use PDF, DOCX, or TXT.');
  }

  return file;
};

export const createUploadResponse = (file: UploadFile): UploadResult => {
  return {
    success: true,
    uploadId: randomUUID(),
    filename: file.originalname,
    size: file.size,
  };
};
