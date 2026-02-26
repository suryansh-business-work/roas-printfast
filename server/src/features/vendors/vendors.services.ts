import { VendorModel, IVendor } from './vendors.models';
import { IPaginatedResult } from '../../types/common';
import { ConflictError, NotFoundError } from '../../utils/errors';
import logger from '../../utils/logger';

interface CreateVendorData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  createdBy: string;
}

interface ListVendorsParams {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
}

interface VendorResponse {
  vendorId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const toVendorResponse = (vendor: IVendor): VendorResponse => ({
  vendorId: vendor._id.toString(),
  name: vendor.name,
  email: vendor.email,
  phone: vendor.phone,
  address: vendor.address,
  city: vendor.city,
  state: vendor.state,
  zipCode: vendor.zipCode,
  contactPerson: vendor.contactPerson,
  isActive: vendor.isActive,
  createdBy: vendor.createdBy.toString(),
  createdAt: vendor.createdAt,
  updatedAt: vendor.updatedAt,
});

export const createVendor = async (data: CreateVendorData): Promise<VendorResponse> => {
  const existing = await VendorModel.findOne({ email: data.email });
  if (existing) {
    throw new ConflictError('Vendor with this email already exists');
  }

  const vendor = await VendorModel.create(data);
  logger.info(`Vendor created: ${vendor._id}`);
  return toVendorResponse(vendor);
};

export const listVendors = async (
  params: ListVendorsParams,
): Promise<IPaginatedResult<VendorResponse>> => {
  const { page, limit, sort, order, search, isActive } = params;

  const filter: Record<string, unknown> = {};
  if (isActive !== undefined) {
    filter.isActive = isActive;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
    ];
  }

  const totalItems = await VendorModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);
  const skip = (page - 1) * limit;

  const vendors = await VendorModel.find(filter)
    .sort({ [sort]: order === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  return {
    items: vendors.map(toVendorResponse),
    totalItems,
    totalPages,
    currentPage: page,
    limit,
  };
};

export const getVendorById = async (id: string): Promise<VendorResponse> => {
  const vendor = await VendorModel.findById(id);
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }
  return toVendorResponse(vendor);
};

export const updateVendor = async (
  id: string,
  data: Partial<CreateVendorData>,
): Promise<VendorResponse> => {
  if (data.email) {
    const existing = await VendorModel.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError('Vendor with this email already exists');
    }
  }

  const vendor = await VendorModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }
  logger.info(`Vendor updated: ${vendor._id}`);
  return toVendorResponse(vendor);
};

export const deactivateVendor = async (id: string): Promise<VendorResponse> => {
  const vendor = await VendorModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }
  logger.info(`Vendor deactivated: ${vendor._id}`);
  return toVendorResponse(vendor);
};

export const activateVendor = async (id: string): Promise<VendorResponse> => {
  const vendor = await VendorModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }
  logger.info(`Vendor activated: ${vendor._id}`);
  return toVendorResponse(vendor);
};

export const listAllActiveVendors = async (): Promise<VendorResponse[]> => {
  const vendors = await VendorModel.find({ isActive: true }).sort({ name: 1 });
  return vendors.map(toVendorResponse);
};
