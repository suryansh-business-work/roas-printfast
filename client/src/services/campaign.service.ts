import api from './api';
import { IApiResponse, IPaginatedResult } from '../types/user.types';
import {
  ICampaignListItem,
  ICampaignDetail,
  ICreateCampaignPayload,
  IUpdateCampaignPayload,
} from '../types/campaign.types';

interface ListCampaignsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  vendor?: string;
  isActive?: string;
}

export const listCampaigns = async (
  params: ListCampaignsParams,
): Promise<IApiResponse<IPaginatedResult<ICampaignListItem>>> => {
  const response = await api.get<IApiResponse<IPaginatedResult<ICampaignListItem>>>('/campaigns', {
    params,
  });
  return response.data;
};

export const getCampaignById = async (id: string): Promise<IApiResponse<ICampaignDetail>> => {
  const response = await api.get<IApiResponse<ICampaignDetail>>(`/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (
  payload: ICreateCampaignPayload,
): Promise<IApiResponse<ICampaignDetail>> => {
  const response = await api.post<IApiResponse<ICampaignDetail>>('/campaigns', payload);
  return response.data;
};

export const updateCampaign = async (
  id: string,
  payload: IUpdateCampaignPayload,
): Promise<IApiResponse<ICampaignDetail>> => {
  const response = await api.patch<IApiResponse<ICampaignDetail>>(`/campaigns/${id}`, payload);
  return response.data;
};

export const uploadPostcardImage = async (
  id: string,
  file: File,
): Promise<IApiResponse<ICampaignDetail>> => {
  const formData = new FormData();
  formData.append('postcardImage', file);
  const response = await api.post<IApiResponse<ICampaignDetail>>(
    `/campaigns/${id}/postcard-image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data;
};

export const deactivateCampaign = async (id: string): Promise<IApiResponse<ICampaignDetail>> => {
  const response = await api.patch<IApiResponse<ICampaignDetail>>(`/campaigns/${id}/deactivate`);
  return response.data;
};

export const activateCampaign = async (id: string): Promise<IApiResponse<ICampaignDetail>> => {
  const response = await api.patch<IApiResponse<ICampaignDetail>>(`/campaigns/${id}/activate`);
  return response.data;
};
