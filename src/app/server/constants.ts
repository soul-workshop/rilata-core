import { JwtConfig, ServerConfig } from './types';

export const defaultServerConfig: Required<ServerConfig> = {
  hostname: 'localhost',
  port: 3000,
  loggerModes: 'all',
};

export const defaultJwtConfig: JwtConfig = {
  algorithm: 'HS256',
  jwtLifetimeAsHour: 24,
  jwtRefreshLifetimeAsHour: 24 * 3,
};
