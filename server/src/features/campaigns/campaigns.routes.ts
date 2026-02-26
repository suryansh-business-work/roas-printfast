import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as campaignsController from './campaigns.controllers';
import { validateRequest } from '../../middleware/validation.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../../types/enums';
import {
  createCampaignSchema,
  updateCampaignSchema,
  updateCampaignWeekSchema,
  listCampaignsQuerySchema,
  campaignIdParamSchema,
  campaignWeekParamSchema,
} from './campaigns.validators';

const router = Router();

// Multer configuration for postcard image uploads
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../../../uploads/postcards'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `postcard-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

// Campaign CRUD routes (God User + Admin)
router.get(
  '/',
  requireAuth,
  validateRequest({ query: listCampaignsQuerySchema }),
  campaignsController.listCampaigns,
);

router.post(
  '/',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ body: createCampaignSchema }),
  campaignsController.createCampaign,
);

router.get(
  '/:id',
  requireAuth,
  validateRequest({ params: campaignIdParamSchema }),
  campaignsController.getCampaignById,
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ params: campaignIdParamSchema, body: updateCampaignSchema }),
  campaignsController.updateCampaign,
);

router.patch(
  '/:id/weeks/:weekNumber',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ params: campaignWeekParamSchema, body: updateCampaignWeekSchema }),
  campaignsController.updateCampaignWeek,
);

router.post(
  '/:id/postcard-image',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  upload.single('postcardImage'),
  campaignsController.uploadPostcardImage,
);

router.patch(
  '/:id/deactivate',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ params: campaignIdParamSchema }),
  campaignsController.deactivateCampaign,
);

router.patch(
  '/:id/activate',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ params: campaignIdParamSchema }),
  campaignsController.activateCampaign,
);

export default router;
