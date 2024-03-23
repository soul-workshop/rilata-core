import { DTO } from '../../domain/dto';
import { BusMessageRepository } from '../database/bus-message-repository';
import { Database } from '../database/database';
import { RunMode } from '../types';
import { Module } from './module';

export type ModuleResolves<M extends Module<DTO>> = {
  runMode: RunMode,
  moduleName: M['moduleName'],
  moduleUrl: string,
  db: Database,
  busMessageRepo: BusMessageRepository<Record<string, unknown>>,
}
