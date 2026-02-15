import api from './api';
import {
  IApiResponse,
  IUser,
  ILoginPayload,
  ISignupPayload,
  IChangePasswordPayload,
} from '../types/user.types';

export const login = async (payload: ILoginPayload): Promise<IApiResponse<IUser>> => {
  const response = await api.post<IApiResponse<IUser>>('/auth/login', payload);
  return response.data;
};

export const signup = async (payload: ISignupPayload): Promise<IApiResponse<IUser>> => {
  const response = await api.post<IApiResponse<IUser>>('/auth/signup', payload);
  return response.data;
};

export const logout = async (): Promise<IApiResponse> => {
  const response = await api.post<IApiResponse>('/auth/logout');
  return response.data;
};

export const getMe = async (): Promise<IApiResponse<IUser>> => {
  const response = await api.get<IApiResponse<IUser>>('/auth/me');
  return response.data;
};

export const changePassword = async (payload: IChangePasswordPayload): Promise<IApiResponse> => {
  const response = await api.post<IApiResponse>('/auth/change-password', payload);
  return response.data;
};
