import { DTO } from '../../domain/dto';
import { Database } from '../database/database';
import { Module } from './module';

export type ModuleResolves<M extends Module<DTO>> = {
  moduleName: M['moduleName'],
  moduleUrls: string[], // example: ['/api/company-module/']
  db: Database,
}
