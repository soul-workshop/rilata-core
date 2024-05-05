import { UuidType } from '../../../common/types';
import { Database } from '../database';

type TransactionId = UuidType;

export interface UnitOfWorkDatabase extends Database {
  startTransaction(): Promise<TransactionId> | TransactionId

  commit(transactionId: TransactionId): Promise<void> | void

  rollback(transactionId: TransactionId): Promise<void> | void
}
