import { UuidType } from '../../../common/types';
import { Database } from '../database';
import { Asyncable } from '../types';

type TransactionId = UuidType;

export interface UnitOfWorkDatabase<ASYNC extends boolean> extends Database {
  startTransaction(): Asyncable<ASYNC, TransactionId>

  commit(transactionId: TransactionId): Asyncable<ASYNC, void>

  rollback(transactionId: TransactionId): Asyncable<ASYNC, void>
}
