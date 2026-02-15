import { ISessionUser } from './common';

declare module 'express-session' {
  interface SessionData {
    user: ISessionUser;
  }
}
