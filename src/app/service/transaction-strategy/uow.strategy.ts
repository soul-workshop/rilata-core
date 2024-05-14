import { Result } from '../../../common/result/types';
import { storeDispatcher } from '../../async-store/store-dispatcher';
import { UnitOfWorkDatabase } from '../../database/module-database/uow.database';
import { TransactionStrategy } from './strategy';

export class UowTransactionStrategy<ASYNC extends boolean>
  extends TransactionStrategy {
  constructor(protected asyncRepo: ASYNC) {
    super();
  }

  protected async executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN) => RET | Promise<RET> }
  >(service: S, input: IN): Promise<RET> {
    const store = storeDispatcher.getStoreOrExepction();
    const db = store.moduleResolver.getDatabase() as UnitOfWorkDatabase<ASYNC>;
    const unitOfWorkId = (this.asyncRepo
      ? await db.startTransaction()
      : db.startTransaction()) as string;
    store.unitOfWorkId = unitOfWorkId;

    try {
      const res = this.asyncRepo
        ? await service.runDomain(input) as Result<unknown, unknown>
        : service.runDomain(input) as Result<unknown, unknown>;
      if (res.isSuccess()) {
        this.asyncRepo ? await db.commit(unitOfWorkId) : db.commit(unitOfWorkId);
      } else {
        this.asyncRepo ? await db.rollback(unitOfWorkId) : db.rollback(unitOfWorkId);
      }

      store.unitOfWorkId = undefined;
      return res as RET;
    } catch (e) {
      this.asyncRepo ? await db.rollback(unitOfWorkId) : db.rollback(unitOfWorkId);
      store.unitOfWorkId = undefined;
      throw e;
    }
  }
}
