import { Constructor } from '../../common/types';
import { Module } from '../module/module';
import { ModuleResolver } from '../resolves/module-resolver';

export type ModuleConstructors<M extends Module> = [
  Constructor<M>,
  Constructor<ModuleResolver<M>>,
];
