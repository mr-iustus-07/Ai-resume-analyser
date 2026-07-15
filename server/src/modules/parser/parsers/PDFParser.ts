import pdfParse from 'pdf-parse';

import { ParserError } from '../parser.types.js';

const hasPdfHeader = (fileBuffer: Buffer): boolean => {
  if (fileBuffer.length < 5) return false;
  const header = fileBuffer.subarray(0, 5).toString('ascii');
  return header === '%PDF-';
};

export class PDFParser {
  async parseText(fileBuffer: Buffer): Promise<string> {
    if (!hasPdfHeader(fileBuffer)) {
      throw new ParserError(
        'Invalid PDF file header. File does not start with %PDF-.',
        'INVALID_PDF_FILE',
        400,
      );
    }

    try {
      const parsed = await pdfParse(fileBuffer);
      return parsed.text ?? '';
    } catch {
      throw new ParserError('Failed to parse PDF content.', 'PDF_PARSE_FAILURE', 400);
    }
  }
}
