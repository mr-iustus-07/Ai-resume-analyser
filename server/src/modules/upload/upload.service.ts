import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

type UploadFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

type UploadResult = {
  success: true;
  uploadId: string;
  filename: string;
  path: string;
  size: number;
};

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set<string>([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/octet-stream',
  'text/plain',
]);

const ALLOWED_EXTENSIONS = new Set<string>(['.pdf', '.docx', '.txt']);

const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

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

  const extension = getFileExtension(file.originalname);
  const mimeAllowed = ALLOWED_MIME_TYPES.has(file.mimetype);
  const extensionAllowed = ALLOWED_EXTENSIONS.has(extension);

  if (!mimeAllowed && !extensionAllowed) {
    throw new UploadValidationError('Unsupported file format. Use PDF, DOCX, or TXT.');
  }

  return file;
};

const TEMP_UPLOAD_DIR = path.resolve(process.cwd(), 'server/temp/uploads');

const sanitizeFilename = (filename: string): string =>
  filename.replace(/[^\w.\- ]/g, '').replace(/\s+/g, '_');

export const createUploadResponse = async (file: UploadFile): Promise<UploadResult> => {
  const uploadId = randomUUID();
  const safeFilename = sanitizeFilename(file.originalname) || 'resume.txt';
  const storedFilename = `${uploadId}__${safeFilename}`;

  await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });
  const filePath = path.join(TEMP_UPLOAD_DIR, storedFilename);
  await fs.writeFile(filePath, file.buffer);

  return {
    success: true,
    uploadId,
    filename: file.originalname,
    path: filePath,
    size: file.size,
  };
};
