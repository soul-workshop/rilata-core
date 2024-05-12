import { UuidType } from '../../../common/types';
import { Asyncable } from '../../types';
import { Database } from '../database';

type TransactionId = UuidType;

export interface UnitOfWorkDatabase<ASYNC extends boolean> extends Database {
  startTransaction(): Asyncable<ASYNC, TransactionId>

  commit(transactionId: TransactionId): Asyncable<ASYNC, void>

  rollback(transactionId: TransactionId): Asyncable<ASYNC, void>
}
