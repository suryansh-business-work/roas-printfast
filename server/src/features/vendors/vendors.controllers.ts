import { Request, Response, NextFunction } from 'express';
import * as vendorsService from './vendors.services';
import { sendSuccess } from '../../utils/response';
import { CreateVendorInput, UpdateVendorInput, ListVendorsQuery } from './vendors.validators';

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as CreateVendorInput;
    const creatorId = req.user!.userId;

    const vendor = await vendorsService.createVendor({
      ...data,
      createdBy: creatorId,
    });

    sendSuccess(res, vendor, 'Vendor created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listVendors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as unknown as ListVendorsQuery;

    const result = await vendorsService.listVendors({
      page: parseInt(query.page || '1', 10),
      limit: parseInt(query.limit || '10', 10),
      sort: query.sort || 'createdAt',
      order: query.order || 'desc',
      search: query.search,
      isActive: query.isActive ? query.isActive === 'true' : undefined,
    });

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const vendor = await vendorsService.getVendorById(req.params.id as string);
    sendSuccess(res, vendor);
  } catch (error) {
    next(error);
  }
};

export const updateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as UpdateVendorInput;
    const vendor = await vendorsService.updateVendor(req.params.id as string, data);
    sendSuccess(res, vendor, 'Vendor updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deactivateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const vendor = await vendorsService.deactivateVendor(req.params.id as string);
    sendSuccess(res, vendor, 'Vendor deactivated successfully');
  } catch (error) {
    next(error);
  }
};

export const activateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const vendor = await vendorsService.activateVendor(req.params.id as string);
    sendSuccess(res, vendor, 'Vendor activated successfully');
  } catch (error) {
    next(error);
  }
};

export const listAllActiveVendors = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const vendors = await vendorsService.listAllActiveVendors();
    sendSuccess(res, vendors);
  } catch (error) {
    next(error);
  }
};
