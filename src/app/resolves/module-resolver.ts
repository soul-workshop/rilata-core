import { Facadable } from './facadable';
import { LoggerResolver } from './loggable';
import { Repositoriable } from './repositoriable';
import { UnitOfWorkable } from './unit-of-workable';

export interface ModuleResolver extends
    LoggerResolver, Repositoriable, Facadable, UnitOfWorkable {}
