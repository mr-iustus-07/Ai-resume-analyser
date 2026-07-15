import { Router } from 'express';

import { AuthController } from './auth.controller.js';

const router = Router();
const authController = new AuthController();

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

router.get('/google', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Google OAuth flow will be wired in next iteration',
    code: 'NOT_IMPLEMENTED',
  });
});

router.get('/google/callback', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Google OAuth callback will be wired in next iteration',
    code: 'NOT_IMPLEMENTED',
  });
});

export const authRouter = router;
