import { UuidType } from '../../common/types';
import { ModuleResolver } from '../resolves/module-resolver';

type TransactionId = UuidType;

export interface Database {
  init(moduleResolver: ModuleResolver, ...args: unknown[]): Promise<void>

  startTransaction(): Promise<TransactionId>

  commit(transactionId: TransactionId): Promise<void>

  rollback(transactionId: TransactionId): Promise<void>
}
