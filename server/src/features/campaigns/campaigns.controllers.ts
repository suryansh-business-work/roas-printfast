import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import * as campaignsService from './campaigns.services';
import { sendSuccess } from '../../utils/response';
import {
  CreateCampaignInput,
  UpdateCampaignInput,
  UpdateCampaignWeekInput,
  ListCampaignsQuery,
} from './campaigns.validators';
import logger from '../../utils/logger';

export const createCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as CreateCampaignInput;
    const creatorId = req.session.user!.userId;

    const campaign = await campaignsService.createCampaign({
      ...data,
      createdBy: creatorId,
    });

    sendSuccess(res, campaign, 'Campaign created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listCampaigns = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as unknown as ListCampaignsQuery;

    const result = await campaignsService.listCampaigns({
      page: parseInt(query.page || '1', 10),
      limit: parseInt(query.limit || '10', 10),
      sort: query.sort || 'createdAt',
      order: query.order || 'desc',
      search: query.search,
      vendor: query.vendor,
      isActive: query.isActive ? query.isActive === 'true' : undefined,
    });

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const campaign = await campaignsService.getCampaignById(req.params.id as string);
    sendSuccess(res, campaign);
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as UpdateCampaignInput;
    const campaign = await campaignsService.updateCampaign(req.params.id as string, data);
    sendSuccess(res, campaign, 'Campaign updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCampaignWeek = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as UpdateCampaignWeekInput;
    const weekNumber = parseInt(req.params.weekNumber as string, 10);
    const campaign = await campaignsService.updateCampaignWeek(
      req.params.id as string,
      weekNumber,
      data,
    );
    sendSuccess(res, campaign, 'Campaign week updated successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadPostcardImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Image file is required' },
      });
      return;
    }

    const imageUrl = `/uploads/postcards/${req.file.filename}`;
    const campaign = await campaignsService.updatePostcardImage(req.params.id as string, imageUrl);

    sendSuccess(res, campaign, 'Postcard image uploaded successfully');
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      const filePath = req.file.path;
      fs.unlink(filePath, (err) => {
        if (err) logger.error('Failed to clean up uploaded file:', err);
      });
    }
    next(error);
  }
};

export const deactivateCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const campaign = await campaignsService.deactivateCampaign(req.params.id as string);
    sendSuccess(res, campaign, 'Campaign deactivated successfully');
  } catch (error) {
    next(error);
  }
};

export const activateCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const campaign = await campaignsService.activateCampaign(req.params.id as string);
    sendSuccess(res, campaign, 'Campaign activated successfully');
  } catch (error) {
    next(error);
  }
};

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../../../../uploads/postcards');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
