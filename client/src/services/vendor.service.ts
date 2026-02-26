import api from './api';
import { IApiResponse, IPaginatedResult } from '../types/user.types';
import { IVendor, ICreateVendorPayload, IUpdateVendorPayload } from '../types/vendor.types';

interface ListVendorsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  isActive?: string;
}

export const listVendors = async (
  params: ListVendorsParams,
): Promise<IApiResponse<IPaginatedResult<IVendor>>> => {
  const response = await api.get<IApiResponse<IPaginatedResult<IVendor>>>('/vendors', { params });
  return response.data;
};

export const getVendorById = async (id: string): Promise<IApiResponse<IVendor>> => {
  const response = await api.get<IApiResponse<IVendor>>(`/vendors/${id}`);
  return response.data;
};

export const createVendor = async (data: ICreateVendorPayload): Promise<IApiResponse<IVendor>> => {
  const response = await api.post<IApiResponse<IVendor>>('/vendors', data);
  return response.data;
};

export const updateVendor = async (
  id: string,
  data: IUpdateVendorPayload,
): Promise<IApiResponse<IVendor>> => {
  const response = await api.put<IApiResponse<IVendor>>(`/vendors/${id}`, data);
  return response.data;
};

export const deactivateVendor = async (id: string): Promise<IApiResponse<IVendor>> => {
  const response = await api.patch<IApiResponse<IVendor>>(`/vendors/${id}/deactivate`);
  return response.data;
};

export const activateVendor = async (id: string): Promise<IApiResponse<IVendor>> => {
  const response = await api.patch<IApiResponse<IVendor>>(`/vendors/${id}/activate`);
  return response.data;
};

export const listAllActiveVendors = async (): Promise<IApiResponse<IVendor[]>> => {
  const response = await api.get<IApiResponse<IVendor[]>>('/vendors/all-active');
  return response.data;
};
