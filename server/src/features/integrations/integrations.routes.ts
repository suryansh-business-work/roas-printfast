import { Router } from 'express';
import * as integrationsController from './integrations.controllers';
import { validateRequest } from '../../middleware/validation.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../../types/enums';
import {
  connectServiceTitanSchema,
  connectJobberSchema,
  disconnectIntegrationSchema,
  vendorIntegrationsParamSchema,
} from './integrations.validators';

const router = Router();

// Get all integrations for a vendor
router.get(
  '/vendor/:vendorId',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ params: vendorIntegrationsParamSchema }),
  integrationsController.getVendorIntegrations,
);

// Connect Service Titan
router.post(
  '/service-titan/connect',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ body: connectServiceTitanSchema }),
  integrationsController.connectServiceTitan,
);

// Connect Jobber
router.post(
  '/jobber/connect',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ body: connectJobberSchema }),
  integrationsController.connectJobber,
);

// Disconnect an integration
router.post(
  '/disconnect',
  requireAuth,
  requireRole(UserRole.GOD_USER, UserRole.ADMIN_USER),
  validateRequest({ body: disconnectIntegrationSchema }),
  integrationsController.disconnectIntegration,
);

export default router;
