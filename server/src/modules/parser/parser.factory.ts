import { DOCXParser } from './parsers/DOCXParser.js';
import { PDFParser } from './parsers/PDFParser.js';
import { TXTParser } from './parsers/TXTParser.js';
import { ParserError } from './parser.types.js';

export type ResumeParser = {
  parseText(fileBuffer: Buffer): Promise<string>;
};

export class ParserFactory {
  static getParser(mimetype: string): ResumeParser {
    switch (mimetype) {
      case 'application/pdf':
        return new PDFParser();
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return new DOCXParser();
      case 'text/plain':
        return new TXTParser();
      default:
        throw new ParserError(
          'Unsupported file format. Use PDF, DOCX, or TXT.',
          'UNSUPPORTED_FILE_TYPE',
          400,
        );
    }
  }
}
