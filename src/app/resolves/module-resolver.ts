import { Databaseable } from './databaseable';
import { Repositoriable } from './repositoriable';
import { Loggable } from './loggable';

export interface ModuleResolver
  extends Loggable, Repositoriable, Databaseable
{
  getModulName(): string
}
