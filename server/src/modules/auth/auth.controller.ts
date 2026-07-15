import type { NextFunction, Request, Response } from 'express';

import {
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
} from './auth.schema.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = RegisterSchema.parse(req.body);
      const tokens = await authService.register(body, req.headers['user-agent'], req.ip);

      res.status(201).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = LoginSchema.parse(req.body);
      const tokens = await authService.login(body, req.headers['user-agent'], req.ip);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const body = RefreshTokenSchema.parse(req.body);
      const tokens = await authService.refresh(body.refreshToken, req.headers['user-agent'], req.ip);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const body = RefreshTokenSchema.parse(req.body);
      await authService.logout(body.refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
