import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.services';
import { sendSuccess } from '../../utils/response';
import { LoginInput, SignupInput, ChangePasswordInput } from './auth.validators';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;
    const sessionUser = await authService.loginUser(email, password);

    req.session.user = sessionUser;

    sendSuccess(res, sessionUser, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body as SignupInput;
    const sessionUser = await authService.signupUser({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    req.session.user = sessionUser;

    sendSuccess(res, sessionUser, 'Account created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
      res.clearCookie('connect.sid');
      sendSuccess(res, undefined, 'Logged out successfully');
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendSuccess(res, req.session.user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as ChangePasswordInput;
    const userId = req.session.user!.userId;

    await authService.changePassword(userId, currentPassword, newPassword);

    sendSuccess(res, undefined, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
