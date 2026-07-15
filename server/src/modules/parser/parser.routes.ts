import { Router } from 'express';

import { parseResumeController } from './parser.controller.js';

const parserRouter = Router();

parserRouter.post('/', parseResumeController);

export default parserRouter;
