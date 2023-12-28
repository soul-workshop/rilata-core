/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { GeneralCommandServiceParams, ServiceResult } from './types';
import { QueryService } from './query-service';
import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../common/exeptions';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { uuidUtility } from '../../common/utils/uuid/uuid-utility';

export abstract class CommandService<
  S_PARAMS extends GeneralCommandServiceParams,
> extends QueryService<S_PARAMS> {
  override async execute(actionDod: S_PARAMS['actionDod']): Promise<ServiceResult<S_PARAMS>> {
    // разрешить юзкейсу перезапуститься 1 раз, если возникла ошибка в БД.
    let databaseErrorRestartAttempts = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await this.executeWithUseOfUnitOfWork(actionDod);
      } catch (e) {
        const { caller } = storeDispatcher.getStoreOrExepction();
        if (e instanceof OptimisticLockVersionMismatchError) {
          this.logger.warning(
            'Произошла оптимистичная блокировка БД, пробуем перезапуститься...',
            { actionDod, caller },
          );
          continue;
        } else if (e instanceof DatabaseObjectSavingError) {
          if (databaseErrorRestartAttempts === 0) {
            this.logger.error(
              'Произошла ошибка БД, перезапуск не помог, прокидываем ошибку дальше...',
              { actionDod, caller },
            );
            throw e;
          }
          this.logger.warning(
            'Произошла ошибка БД, пробуем перезапуститься...',
            { actionDod, caller },
          );
          databaseErrorRestartAttempts -= 1;
          continue;
        } else {
          throw e;
        }
      }
    }
  }

  protected async executeWithUseOfUnitOfWork(
    actionDod: S_PARAMS['actionDod'],
  ): Promise<ServiceResult<S_PARAMS>> {
    const unitOfWorkId = uuidUtility.getNewUUID();
    const store = storeDispatcher.getStoreOrExepction();
    store.unitOfWorkId = unitOfWorkId;
    const db = store.moduleResolver.getDatabase();
    await db.startTransaction(unitOfWorkId);

    try {
      const res = await super.execute(actionDod);
      if (res.isSuccess()) await db.commit(unitOfWorkId);
      else await db.rollback(unitOfWorkId);
      return res;
    } catch (e) {
      await db.rollback(unitOfWorkId);
      throw e;
    }
  }
}
