import api from './api';
import {
  IApiResponse,
  IUserDetail,
  IPaginatedResult,
  ICreateUserPayload,
  ICreateUserResponse,
} from '../types/user.types';

interface ListUsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  role?: string;
  isActive?: string;
}

export const listUsers = async (
  params: ListUsersParams,
): Promise<IApiResponse<IPaginatedResult<IUserDetail>>> => {
  const response = await api.get<IApiResponse<IPaginatedResult<IUserDetail>>>('/users', {
    params,
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<IApiResponse<IUserDetail>> => {
  const response = await api.get<IApiResponse<IUserDetail>>(`/users/${id}`);
  return response.data;
};

export const createUser = async (
  payload: ICreateUserPayload,
): Promise<IApiResponse<ICreateUserResponse>> => {
  const response = await api.post<IApiResponse<ICreateUserResponse>>('/users', payload);
  return response.data;
};

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<IApiResponse<IUserDetail>> => {
  const response = await api.patch<IApiResponse<IUserDetail>>(`/users/${id}`, payload);
  return response.data;
};

export const deactivateUser = async (id: string): Promise<IApiResponse<IUserDetail>> => {
  const response = await api.patch<IApiResponse<IUserDetail>>(`/users/${id}/deactivate`);
  return response.data;
};

export const activateUser = async (id: string): Promise<IApiResponse<IUserDetail>> => {
  const response = await api.patch<IApiResponse<IUserDetail>>(`/users/${id}/activate`);
  return response.data;
};

export const getProfile = async (): Promise<IApiResponse<IUserDetail>> => {
  const response = await api.get<IApiResponse<IUserDetail>>('/users/profile');
  return response.data;
};

export const updateProfile = async (
  payload: UpdateUserPayload,
): Promise<IApiResponse<IUserDetail>> => {
  const response = await api.patch<IApiResponse<IUserDetail>>('/users/profile', payload);
  return response.data;
};
