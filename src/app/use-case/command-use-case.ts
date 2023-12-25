/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { GeneralCommandUcParams, UcResult } from './types';
import { QueryUseCase } from './query-use-case';
import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../common/exeptions';
import { storeDispatcher } from '../async-store/store-dispatcher';

export abstract class CommandUseCase<
  UC_PARAMS extends GeneralCommandUcParams,
> extends QueryUseCase<UC_PARAMS> {
  override async execute(actionDod: UC_PARAMS['actionDod']): Promise<UcResult<UC_PARAMS>> {
    // разрешить юзкейсу перезапуститься 1 раз, если возникла ошибка в БД.
    let databaseErrorRestartAttempts = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await this.executeUseOfUnitOfWork(actionDod);
      } catch (e) {
        if (e instanceof OptimisticLockVersionMismatchError) {
          continue;
        } else if (e instanceof DatabaseObjectSavingError) {
          if (databaseErrorRestartAttempts === 0) throw e;
          databaseErrorRestartAttempts -= 1;
          continue;
        } else {
          throw e;
        }
      }
    }
  }

  protected async executeUseOfUnitOfWork(actionDod: UC_PARAMS['actionDod']): Promise<UcResult<UC_PARAMS>> {
    const store = storeDispatcher.getStoreOrExepction();
    const db = store.moduleResolver.getDatabase();

    try {
      const res = await super.execute(actionDod);
      if (res.isSuccess()) await db.commit();
      else await db.rollback();
      return res;
    } catch (e) {
      await db.rollback();
      throw e;
    }
  }
}
