import { BusMessageRepository } from '../database/bus-message-repository';
import { Database } from '../database/database';
import { RunMode } from '../types';
import { Module } from './module';

export type ModuleResolves<M extends Module> = {
  tokenSecretKey: string,
  runMode: RunMode,
  moduleName: M['moduleName'],
  db: Database,
  busMessageRepo: BusMessageRepository<Record<string, unknown>>,
}
