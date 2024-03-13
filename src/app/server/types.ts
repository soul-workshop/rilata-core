import { loggerModes } from '../../common/logger/logger-modes';
import { Constructor } from '../../common/types';
import { Module } from '../module/module';
import { ModuleResolver } from '../module/module-resolver';
import { ModuleResolves } from '../module/module-resolves';
import { RunMode } from '../types';

export type ModuleConstructors<M extends Module> = [
  Constructor<M>,
  Constructor<ModuleResolver<M, ModuleResolves<M>>>,
  (runMode: RunMode) => ModuleResolves<M>,
];

export type ServerConfig = {
  hostname?: string,
  port?: number,
  loggerModes?: Array<keyof typeof loggerModes> | 'all' | 'off'
}
