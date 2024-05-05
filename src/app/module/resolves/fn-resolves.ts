import { FnDatabase } from '../../database/module-database/fn.database';
import { Module } from '../module';
import { ModuleResolves } from '../resolves';

export type FnModuleResolves<M extends Module> = ModuleResolves<M> & {
  db: FnDatabase,
}
