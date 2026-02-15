import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

interface IConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  sessionSecret: string;
  sessionMaxAge: number;
  corsOrigin: string;
  allowAdminSignup: boolean;
  godUserEmail: string;
  godUserPassword: string;
  godUserFirstName: string;
  godUserLastName: string;
}

const config: IConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/roas-printfast',
  sessionSecret: process.env.SESSION_SECRET || 'default-dev-secret-change-in-production',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  allowAdminSignup: process.env.ALLOW_ADMIN_SIGNUP === 'true',
  godUserEmail: process.env.GOD_USER_EMAIL || 'admin@roasprintfast.com',
  godUserPassword: process.env.GOD_USER_PASSWORD || 'ChangeThisPassword123!',
  godUserFirstName: process.env.GOD_USER_FIRST_NAME || 'Super',
  godUserLastName: process.env.GOD_USER_LAST_NAME || 'Admin',
};

export default config;
