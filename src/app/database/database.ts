import { UuidType } from '../../common/types';
import { ModuleResolver } from '../resolves/module-resolver';

export interface Database {
  init(moduleResolver: ModuleResolver, ...args: unknown[]): Promise<void>

  getUnitOfWorkId(): UuidType

  startTransaction(unitOfWorkId?: UuidType, ...args: unknown[]): Promise<unknown>

  commit(unitOfWorkId?: UuidType, ...args: unknown[]): Promise<unknown>

  rollback(unitOfWorkId?: UuidType, ...args: unknown[]): Promise<unknown>
}
