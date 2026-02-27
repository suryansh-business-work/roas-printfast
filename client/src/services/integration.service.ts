import api from './api';
import { IApiResponse } from '../types/user.types';
import {
  IIntegration,
  IConnectServiceTitanPayload,
  IConnectJobberPayload,
  IDisconnectIntegrationPayload,
} from '../types/integration.types';

export const getVendorIntegrations = async (
  vendorId: string,
): Promise<IApiResponse<IIntegration[]>> => {
  const response = await api.get<IApiResponse<IIntegration[]>>(`/integrations/vendor/${vendorId}`);
  return response.data;
};

export const connectServiceTitan = async (
  payload: IConnectServiceTitanPayload,
): Promise<IApiResponse<IIntegration>> => {
  const response = await api.post<IApiResponse<IIntegration>>(
    '/integrations/service-titan/connect',
    payload,
  );
  return response.data;
};

export const connectJobber = async (
  payload: IConnectJobberPayload,
): Promise<IApiResponse<IIntegration>> => {
  const response = await api.post<IApiResponse<IIntegration>>(
    '/integrations/jobber/connect',
    payload,
  );
  return response.data;
};

export const disconnectIntegration = async (
  payload: IDisconnectIntegrationPayload,
): Promise<IApiResponse<IIntegration>> => {
  const response = await api.post<IApiResponse<IIntegration>>('/integrations/disconnect', payload);
  return response.data;
};
