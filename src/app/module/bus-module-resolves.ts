import { DTO } from '../../domain/dto';
import { BusMessageRepository } from '../database/bus-message-repository';
import { Module } from './module';
import { ModuleResolves } from './module-resolves';

export type BusModuleResolves<M extends Module<DTO>> = ModuleResolves<M> & {
  busMessageRepo: BusMessageRepository,
}
