import { UuidType } from '../../common/types';
import { GeneralModuleResolver } from '../module/types';

type TransactionId = UuidType;

export interface Database {
  init(moduleResolver: GeneralModuleResolver, ...args: unknown[]): Promise<void>

  stop(): void

  startTransaction(): Promise<TransactionId>

  commit(transactionId: TransactionId): Promise<void>

  rollback(transactionId: TransactionId): Promise<void>
}
