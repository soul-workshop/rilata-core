import { Result } from '../../../common/result/types';
import { storeDispatcher } from '../../async-store/store-dispatcher';
import { UnitOfWorkDatabase } from '../../database/module-database/uow.database';
import { TransactionStrategy } from './strategy';

export abstract class UowTransactionStrategy
  extends TransactionStrategy {
  protected async executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN) => RET | Promise<RET> }
  >(service: S, input: IN): Promise<RET> {
    const store = storeDispatcher.getStoreOrExepction();
    const db = store.moduleResolver.getDatabase() as UnitOfWorkDatabase;
    const unitOfWorkId = await db.startTransaction();
    store.unitOfWorkId = unitOfWorkId;

    try {
      const res = await service.runDomain(input) as Result<unknown, unknown>;
      if (res.isSuccess()) await db.commit(unitOfWorkId);
      else await db.rollback(unitOfWorkId);

      store.unitOfWorkId = undefined;
      return res as RET;
    } catch (e) {
      await db.rollback(unitOfWorkId);
      store.unitOfWorkId = undefined;
      throw e;
    }
  }
}
