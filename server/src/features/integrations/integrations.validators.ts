import { z } from 'zod';

export const connectServiceTitanSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  environment: z.enum(['production', 'integration'], {
    required_error: 'Environment is required',
  }),
});

export const connectJobberSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  code: z.string().min(1, 'OAuth code is required'),
});

export const disconnectIntegrationSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  provider: z.enum(['service_titan', 'jobber', 'service_ware'], {
    required_error: 'Provider is required',
  }),
});

export const vendorIntegrationsParamSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
});

export type ConnectServiceTitanInput = z.infer<typeof connectServiceTitanSchema>;
export type ConnectJobberInput = z.infer<typeof connectJobberSchema>;
export type DisconnectIntegrationInput = z.infer<typeof disconnectIntegrationSchema>;
