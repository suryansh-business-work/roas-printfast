import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

interface IConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  sessionSecret: string;
  sessionMaxAge: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string | string[];
  allowAdminSignup: boolean;
  allowSendGodCredentials: boolean;
  godUserEmail: string;
  godUserPassword: string;
  godUserFirstName: string;
  godUserLastName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  imagekitPublicKey: string;
  imagekitPrivateKey: string;
  imagekitUrlEndpoint: string;
}

const parseCorsOrigin = (): string | string[] => {
  const raw = process.env.CORS_ORIGIN || 'http://localhost:4036';
  return raw.includes(',') ? raw.split(',').map((s) => s.trim()) : raw;
};

const config: IConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4037', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/roas-printfast',
  sessionSecret: process.env.SESSION_SECRET || 'default-dev-secret-change-in-production',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  corsOrigin: parseCorsOrigin(),
  allowAdminSignup: process.env.ALLOW_ADMIN_SIGNUP === 'true',
  allowSendGodCredentials: process.env.ALLOW_SEND_GOD_CREDENTIALS === 'true',
  godUserEmail: process.env.GOD_USER_EMAIL || 'suryansh@exyconn.com',
  godUserPassword: process.env.GOD_USER_PASSWORD || 'ChangeThisPassword123!',
  godUserFirstName: process.env.GOD_USER_FIRST_NAME || 'Super',
  godUserLastName: process.env.GOD_USER_LAST_NAME || 'Admin',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINTS || '',
};

export default config;
