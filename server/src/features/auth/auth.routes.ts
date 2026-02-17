import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from './auth.controllers';
import { validateRequest } from '../../middleware/validation.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { loginSchema, signupSchema, changePasswordSchema } from './auth.validators';

const sendGodCredentialsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests. Please try again after 5 minutes.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/login', validateRequest({ body: loginSchema }), authController.login);

router.post('/signup', validateRequest({ body: signupSchema }), authController.signup);

router.post('/logout', requireAuth, authController.logout);

router.get('/me', requireAuth, authController.me);

router.post(
  '/change-password',
  requireAuth,
  validateRequest({ body: changePasswordSchema }),
  authController.changePassword,
);

router.post(
  '/send-god-user-credentials',
  sendGodCredentialsLimiter,
  authController.sendGodUserCredentials,
);

export default router;
