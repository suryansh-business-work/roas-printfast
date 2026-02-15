import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/enums';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.session?.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!roles.includes(req.session.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};
