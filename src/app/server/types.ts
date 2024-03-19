import { loggerModes } from '../../common/logger/logger-modes';
import { Constructor } from '../../common/types';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { ModuleResolver } from '../module/module-resolver';
import { ModuleResolves } from '../module/module-resolves';
import { RunMode } from '../types';

export type ModuleConstructors<JWT_P extends DTO> = [
  Constructor<Module<JWT_P>>,
  Constructor<ModuleResolver<JWT_P, Module<JWT_P>, ModuleResolves<Module<JWT_P>>>>,
  (runMode: RunMode) => ModuleResolves<Module<JWT_P>>,
];

export type ServerConfig = {
  hostname?: string, // default localhost
  port?: number, // default 3000
  loggerModes?: Array<keyof typeof loggerModes> | 'all' | 'off' // default 'all'
}

export type JwtConfig = {
  algorithm?: 'HS256' | 'HS512', // default 'HS256'
  jwtLifetimeAsHour?: number, // default 1 day (24)
  jwtRefreshLifetimeAsHour?: number // default 3 day (24*3)
}
