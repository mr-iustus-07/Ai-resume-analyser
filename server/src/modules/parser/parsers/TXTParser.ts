const stripUtf8Bom = (value: string): string => value.replace(/^\uFEFF/, '');

const decodeUtf16 = (buffer: Buffer, littleEndian: boolean): string => {
  if (littleEndian) {
    return buffer.toString('utf16le');
  }

  // Convert UTF-16 BE to LE manually for Node decoding
  const swapped = Buffer.from(buffer);
  for (let i = 0; i < swapped.length - 1; i += 2) {
    const first = swapped[i];
    swapped[i] = swapped[i + 1]!;
    swapped[i + 1] = first!;
  }
  return swapped.toString('utf16le');
};

const looksLikeUtf16LeWithoutBom = (buffer: Buffer): boolean => {
  if (buffer.length < 4) return false;
  const sample = buffer.subarray(0, Math.min(buffer.length, 200));
  let zeroOdd = 0;
  let pairs = 0;
  for (let i = 1; i < sample.length; i += 2) {
    if (sample[i] === 0x00) zeroOdd++;
    pairs++;
  }
  return pairs > 0 && zeroOdd / pairs > 0.4;
};

const decodeWindows1252BestEffort = (buffer: Buffer): string => {
  return buffer.toString('latin1');
};

const normalizeDecodedText = (value: string): string => {
  return stripUtf8Bom(value).replace(/\u0000/g, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};

export class TXTParser {
  async parseText(fileBuffer: Buffer): Promise<string> {
    if (fileBuffer.length === 0) return '';

    // UTF-16 LE BOM
    if (fileBuffer.length >= 2 && fileBuffer[0] === 0xff && fileBuffer[1] === 0xfe) {
      return normalizeDecodedText(decodeUtf16(fileBuffer.subarray(2), true));
    }

    // UTF-16 BE BOM
    if (fileBuffer.length >= 2 && fileBuffer[0] === 0xfe && fileBuffer[1] === 0xff) {
      return normalizeDecodedText(decodeUtf16(fileBuffer.subarray(2), false));
    }

    // UTF-8 BOM
    if (
      fileBuffer.length >= 3 &&
      fileBuffer[0] === 0xef &&
      fileBuffer[1] === 0xbb &&
      fileBuffer[2] === 0xbf
    ) {
      return normalizeDecodedText(fileBuffer.toString('utf8', 3));
    }

    // UTF-16 LE without BOM heuristic
    if (looksLikeUtf16LeWithoutBom(fileBuffer)) {
      return normalizeDecodedText(decodeUtf16(fileBuffer, true));
    }

    // Primary UTF-8 decode
    const utf8Decoded = normalizeDecodedText(fileBuffer.toString('utf8'));
    const replacementCharCount = (utf8Decoded.match(/\uFFFD/g) ?? []).length;

    // Best-effort fallback for likely non-UTF8 data
    if (replacementCharCount > 2) {
      return normalizeDecodedText(decodeWindows1252BestEffort(fileBuffer));
    }

    return utf8Decoded;
  }
}
