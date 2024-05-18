import { GeneralServerResolver } from '../server/types';
import { Module } from './module';
import { ModuleResolver } from './m-resolver';
import { ModuleResolves } from './m-resolves';

export type ModuleType = 'command-module' | 'read-module' | 'common-module';

export type GeneralModuleResolver = ModuleResolver<
  GeneralServerResolver, ModuleResolves<Module>
>

export type GetModule<MR extends ModuleResolves<Module>> =
  MR extends ModuleResolves<infer M> ? M : never

export type GetModuleResolves<MRR extends GeneralModuleResolver> =
  MRR extends ModuleResolver<GeneralServerResolver, infer MRS>
    ? MRS
    : never
