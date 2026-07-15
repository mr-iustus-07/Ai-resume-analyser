import mammoth from 'mammoth';

import { ParserError } from '../parser.types.js';

export class DOCXParser {
  async parseText(fileBuffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value ?? '';
    } catch {
      throw new ParserError('Unreadable DOCX file.', 'CORRUPTED_FILE', 400);
    }
  }
}
