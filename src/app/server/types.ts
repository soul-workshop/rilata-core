import { loggerModes } from '../../common/logger/logger-modes';
import { Constructor } from '../../common/types';
import { DTO } from '../../domain/dto';
import { Module } from '../module/module';
import { ModuleResolves } from '../module/m-resolves';
import { GeneralModuleResolver } from '../module/types';
import { ServerResolver } from './s-resolver';
import { ServerResolves } from './s-resolves';

export type ModuleConstructors<M extends Module> = [
  Constructor<M>,
  Constructor<GeneralModuleResolver>,
  ModuleResolves<M>,
];

export type GeneralServerResolver = ServerResolver<ServerResolves<DTO>>

export type GetJwtType<RSR extends GeneralServerResolver> =
  RSR extends ServerResolver<infer RSS>
    ? RSS extends ServerResolves<infer JWT_T>
      ? JWT_T
      : never
    : never

export type GetServerResolves<SR extends GeneralServerResolver> =
  SR extends ServerResolver<infer T> ? T : never

export type ServerConfig = {
  hostname?: string, // default localhost
  port?: number, // default 3000
  loggerModes?: Array<keyof typeof loggerModes> | 'all' | 'off' // default 'all'
}

export type JwtConfig = {
  algorithm: 'HS256' | 'HS512', // default 'HS256'
  jwtLifetimeAsHour: number, // default 1 day (24)
  jwtRefreshLifetimeAsHour: number
}
