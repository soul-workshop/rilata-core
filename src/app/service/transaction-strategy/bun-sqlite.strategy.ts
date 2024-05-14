import { BunSqliteDatabase } from '../../../infra/repo/bun-sqlite/database';
import { storeDispatcher } from '../../async-store/store-dispatcher';
import { TransactionStrategy } from './strategy';

export class BunSqliteStrategy extends TransactionStrategy {
  protected executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN) => RET }
  >(service: S, input: IN): RET {
    const store = storeDispatcher.getStoreOrExepction();
    const db = store.moduleResolver.getDatabase() as BunSqliteDatabase;
    const transactionFn = db.sqliteDb.transaction(() => service.runDomain(input));
    return transactionFn();
  }
}
