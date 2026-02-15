import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.session?.user) {
    throw new UnauthorizedError('Authentication required');
  }
  next();
};
