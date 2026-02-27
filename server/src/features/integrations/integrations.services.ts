import {
  IntegrationModel,
  IIntegration,
  IntegrationProvider,
  IntegrationStatus,
} from './integrations.models';
import { VendorModel } from '../vendors/vendors.models';
import { NotFoundError, ConflictError } from '../../utils/errors';
import logger from '../../utils/logger';

interface IntegrationResponse {
  integrationId: string;
  vendorId: string;
  provider: string;
  status: string;
  environment?: string;
  connectedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const toIntegrationResponse = (integration: IIntegration): IntegrationResponse => ({
  integrationId: integration._id.toString(),
  vendorId: integration.vendor.toString(),
  provider: integration.provider,
  status: integration.status,
  environment: integration.credentials?.environment,
  connectedAt: integration.connectedAt,
  isActive: integration.isActive,
  createdAt: integration.createdAt,
  updatedAt: integration.updatedAt,
});

export const getVendorIntegrations = async (vendorId: string): Promise<IntegrationResponse[]> => {
  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }

  const integrations = await IntegrationModel.find({
    vendor: vendorId,
    isActive: true,
  });

  return integrations.map(toIntegrationResponse);
};

export const connectServiceTitan = async (
  vendorId: string,
  tenantId: string,
  clientId: string,
  clientSecret: string,
  environment: string,
  createdBy: string,
): Promise<IntegrationResponse> => {
  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }

  // Check if already connected
  const existing = await IntegrationModel.findOne({
    vendor: vendorId,
    provider: IntegrationProvider.SERVICE_TITAN,
    isActive: true,
  });

  if (existing && existing.status === IntegrationStatus.CONNECTED) {
    throw new ConflictError('Service Titan integration already connected for this vendor');
  }

  const integration = existing
    ? await IntegrationModel.findByIdAndUpdate(
        existing._id,
        {
          status: IntegrationStatus.CONNECTED,
          credentials: { tenantId, clientId, clientSecret, environment },
          connectedAt: new Date(),
        },
        { new: true },
      )
    : await IntegrationModel.create({
        vendor: vendorId,
        provider: IntegrationProvider.SERVICE_TITAN,
        status: IntegrationStatus.CONNECTED,
        credentials: { tenantId, clientId, clientSecret, environment },
        connectedAt: new Date(),
        createdBy,
      });

  if (!integration) {
    throw new NotFoundError('Failed to create integration');
  }

  logger.info(`Service Titan connected for vendor ${vendorId}`);
  return toIntegrationResponse(integration);
};

export const connectJobber = async (
  vendorId: string,
  code: string,
  createdBy: string,
): Promise<IntegrationResponse> => {
  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }

  const existing = await IntegrationModel.findOne({
    vendor: vendorId,
    provider: IntegrationProvider.JOBBER,
    isActive: true,
  });

  if (existing && existing.status === IntegrationStatus.CONNECTED) {
    throw new ConflictError('Jobber integration already connected for this vendor');
  }

  // In a real implementation, exchange the code for tokens via Jobber OAuth
  const integration = existing
    ? await IntegrationModel.findByIdAndUpdate(
        existing._id,
        {
          status: IntegrationStatus.CONNECTED,
          credentials: { accessToken: code },
          connectedAt: new Date(),
        },
        { new: true },
      )
    : await IntegrationModel.create({
        vendor: vendorId,
        provider: IntegrationProvider.JOBBER,
        status: IntegrationStatus.CONNECTED,
        credentials: { accessToken: code },
        connectedAt: new Date(),
        createdBy,
      });

  if (!integration) {
    throw new NotFoundError('Failed to create integration');
  }

  logger.info(`Jobber connected for vendor ${vendorId}`);
  return toIntegrationResponse(integration);
};

export const disconnectIntegration = async (
  vendorId: string,
  provider: string,
): Promise<IntegrationResponse> => {
  const integration = await IntegrationModel.findOne({
    vendor: vendorId,
    provider,
    isActive: true,
  });

  if (!integration) {
    throw new NotFoundError('Integration not found');
  }

  integration.status = IntegrationStatus.DISCONNECTED;
  integration.credentials = {};
  integration.connectedAt = null;
  await integration.save();

  logger.info(`Integration ${provider} disconnected for vendor ${vendorId}`);
  return toIntegrationResponse(integration);
};
