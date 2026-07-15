import { Router } from 'express';

import { AnalysisController } from './analysis.controller.js';
import { AnalysisService } from './analysis.service.js';

export const analysisRouter = Router();

const analysisController = new AnalysisController(new AnalysisService());

analysisRouter.post('/analyze', async (req, res) => {
  try {
    const response = await analysisController.analyze(req.body);
    res.status(200).json(response);
  } catch (err) {
    // Keep error mapping lightweight for now; parser module has its own error handling pattern.
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ success: false, error: message });
  }
});
