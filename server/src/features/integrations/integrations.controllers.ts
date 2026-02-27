import { Request, Response, NextFunction } from 'express';
import * as integrationsService from './integrations.services';
import { sendSuccess } from '../../utils/response';
import {
  ConnectServiceTitanInput,
  ConnectJobberInput,
  DisconnectIntegrationInput,
} from './integrations.validators';

export const getVendorIntegrations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { vendorId } = req.params;
    const integrations = await integrationsService.getVendorIntegrations(vendorId as string);
    sendSuccess(res, integrations);
  } catch (error) {
    next(error);
  }
};

export const connectServiceTitan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as ConnectServiceTitanInput;
    const creatorId = req.user!.userId;

    const integration = await integrationsService.connectServiceTitan(
      data.vendorId,
      data.tenantId,
      data.clientId,
      data.clientSecret,
      data.environment,
      creatorId,
    );

    sendSuccess(res, integration, 'Service Titan connected successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const connectJobber = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as ConnectJobberInput;
    const creatorId = req.user!.userId;

    const integration = await integrationsService.connectJobber(
      data.vendorId,
      data.code,
      creatorId,
    );

    sendSuccess(res, integration, 'Jobber connected successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const disconnectIntegration = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as DisconnectIntegrationInput;
    const integration = await integrationsService.disconnectIntegration(
      data.vendorId,
      data.provider,
    );

    sendSuccess(res, integration, 'Integration disconnected successfully');
  } catch (error) {
    next(error);
  }
};
