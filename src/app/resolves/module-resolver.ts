import { Databaseable } from './databaseable';
import { Loggable } from './loggable';
import { Repositoriable } from './repositoriable';

export interface ModuleResolver extends
    Loggable, Repositoriable, Databaseable {}
