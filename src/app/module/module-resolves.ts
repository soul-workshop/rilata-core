import { Database } from '../database/database';
import { EventRepository } from '../database/event-repository';
import { TestDatabase } from '../database/test-database';
import { RunMode } from '../types';
import { Module } from './module';

export type ModuleResolves<M extends Module> = {
  runMode: RunMode,
  moduleName: M['moduleName'],
  db: Database | TestDatabase,
  eventRepo: EventRepository,
}
