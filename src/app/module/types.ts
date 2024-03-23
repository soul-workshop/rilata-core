import { DTO } from '../../domain/dto';
import { Module } from './module';
import { ModuleResolver } from './module-resolver';
import { ModuleResolves } from './module-resolves';

export type ModuleType = 'command-module' | 'read-module' | 'common-module';

export type ModuleConfig = {
  /** url контроллера данного модуля */
  ModuleUrl: string,
}

export type GeneralModuleResolver = ModuleResolver<DTO, Module<DTO>, ModuleResolves<Module<DTO>>>
