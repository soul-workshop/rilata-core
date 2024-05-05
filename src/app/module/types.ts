import { GeneralServerResolver } from '../server/types';
import { Module } from './module';
import { ModuleResolver } from './resolver';
import { ModuleResolves } from './resolves';

export type ModuleType = 'command-module' | 'read-module' | 'common-module';

export type GeneralModuleResolver = ModuleResolver<
  GeneralServerResolver, ModuleResolves<Module>
>

export type GetModuleType<MR extends ModuleResolves<Module>> =
  MR extends ModuleResolves<infer M> ? M : never
