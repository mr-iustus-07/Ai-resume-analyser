import { Router } from 'express';
import multer from 'multer';

import {
  MAX_UPLOAD_SIZE,
  UploadValidationError,
  createUploadResponse,
  validateUploadFile,
} from './upload.service.js';

const uploadRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_SIZE,
    files: 1,
  },
});

uploadRouter.post('/', upload.single('resume'), async (req, res) => {
  try {
    const validFile = validateUploadFile(req.file);
    const response = await createUploadResponse(validFile);

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unexpected upload error occurred.',
    });
  }
});

export default uploadRouter;
