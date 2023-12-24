import { UnitOfWork } from '../unit-of-work/unit-of-work';
import { Databaseable } from './databaseable';

export interface UnitOfWorkable {
  createUnitOfWork(): UnitOfWork

  getCurrentUnitOfWork(): UnitOfWork

  getDatabase(): Databaseable
}
