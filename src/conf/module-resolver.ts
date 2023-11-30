import { Realisable } from '../domain/realisable';
import { Repositoriable } from '../domain/repositoriable';
import { LoggerResolver } from './logger-resolver';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModuleResolver extends LoggerResolver, Repositoriable, Realisable {}
