import { type Request, type Response } from 'express';

import { isParserError, parseResumeFromUploadId } from './parser.service.js';
import { type ParseRequestBody } from './parser.types.js';
import { ParserError } from './parser.types.js';

export const parseResumeController = async (
  req: Request<object, object, ParseRequestBody>,
  res: Response,
): Promise<Response> => {
  try {
    const uploadId = req.body.uploadId?.trim();

    if (!uploadId) {
      throw new ParserError('uploadId is required.', 'MISSING_UPLOAD_ID', 400);
    }

    const parsedResume = await parseResumeFromUploadId(uploadId);

    return res.status(200).json({
      success: true,
      data: parsedResume,
    });
  } catch (error) {
    if (isParserError(error)) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'PARSER_FAILURE',
        message: 'Failed to parse resume due to an unexpected error.',
      },
    });
  }
};
