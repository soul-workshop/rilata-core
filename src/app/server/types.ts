import { loggerModes } from '../../common/logger/logger-modes';
import { Constructor } from '../../common/types';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { ModuleResolver } from '../module/module-resolver';
import { ModuleResolves } from '../module/module-resolves';

export type ModuleConstructors<M extends Module<DTO>> = [
  Constructor<M>,
  Constructor<ModuleResolver<DTO, M, ModuleResolves<M>>>,
  ModuleResolves<M>,
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
