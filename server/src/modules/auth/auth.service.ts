import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const ACCESS_TOKEN_TYPE = 'access';
const REFRESH_TOKEN_TYPE = 'refresh';

type JwtPayload = {
  sub: string;
  type: 'access' | 'refresh';
};

export class AuthService {
  async register(input: RegisterInput, userAgent?: string, ipAddress?: string) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        passwordHash,
        authProvider: 'EMAIL',
      },
    });

    return this.createSessionTokens(user.id, userAgent, ipAddress);
  }

  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user?.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.createSessionTokens(user.id, userAgent, ipAddress);
  }

  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    const decoded = this.verifyToken(refreshToken, REFRESH_TOKEN_TYPE);
    const session = await prisma.session.findUnique({
      where: { id: decoded.sub },
    });

    if (!session || session.expiresAt.getTime() < Date.now()) {
      throw new Error('Invalid refresh token');
    }

    await prisma.session.delete({ where: { id: session.id } });

    return this.createSessionTokens(session.userId, userAgent, ipAddress);
  }

  async logout(refreshToken: string) {
    try {
      const decoded = this.verifyToken(refreshToken, REFRESH_TOKEN_TYPE);
      await prisma.session.delete({
        where: { id: decoded.sub },
      });
    } catch {
      // no-op for idempotent logout
    }
  }

  private async createSessionTokens(userId: string, userAgent?: string, ipAddress?: string) {
    const refreshExpiresAt = this.getExpiryDate(env.JWT_REFRESH_TTL);

    const session = await prisma.session.create({
      data: {
        userId,
        refreshToken: 'issued',
        userAgent,
        ipAddress,
        expiresAt: refreshExpiresAt,
      },
    });

    const accessToken = this.signToken(
      { sub: userId, type: ACCESS_TOKEN_TYPE },
      env.JWT_ACCESS_SECRET,
      env.JWT_ACCESS_TTL,
    );

    const refreshToken = this.signToken(
      { sub: session.id, type: REFRESH_TOKEN_TYPE },
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_TTL,
    );

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_ACCESS_TTL,
    };
  }

  private signToken(payload: JwtPayload, secret: string, expiresIn: string): string {
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, secret as Secret, options);
  }

  private verifyToken(token: string, expectedType: JwtPayload['type']): JwtPayload {
    const decoded = jwt.verify(
      token,
      expectedType === ACCESS_TOKEN_TYPE ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET,
    ) as JwtPayload;

    if (decoded.type !== expectedType) {
      throw new Error('Invalid token type');
    }

    return decoded;
  }

  private getExpiryDate(ttl: string): Date {
    const now = Date.now();

    if (ttl.endsWith('d')) {
      return new Date(now + Number(ttl.slice(0, -1)) * 24 * 60 * 60 * 1000);
    }

    if (ttl.endsWith('h')) {
      return new Date(now + Number(ttl.slice(0, -1)) * 60 * 60 * 1000);
    }

    if (ttl.endsWith('m')) {
      return new Date(now + Number(ttl.slice(0, -1)) * 60 * 1000);
    }

    return new Date(now + 7 * 24 * 60 * 60 * 1000);
  }
}
