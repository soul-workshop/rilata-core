import { DTO } from '../../../domain/dto';
import { UnitOfWorkDatabase } from '../../database/module-database/uow.database';
import { Module } from '../module';
import { ModuleResolves } from '../resolves';

export type UowModuleResolves<M extends Module<DTO>> = ModuleResolves<M> & {
  db: UnitOfWorkDatabase,
}
