/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { GeneralBaseServiceParams, ServiceResult } from './types';
import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../common/exeptions';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { BaseService } from './base-service';

/** Сервис, приводящий к изменению состояния приложения (доменной области) */
export abstract class MuttableService<
  S_PARAMS extends GeneralBaseServiceParams,
> extends BaseService<S_PARAMS> {
  override async execute(input: S_PARAMS['input']): Promise<ServiceResult<S_PARAMS>> {
    const store = storeDispatcher.getStoreOrExepction();
    // разрешить юзкейсу перезапуститься 1 раз, если возникла ошибка в БД.
    store.databaseErrorRestartAttempts = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await this.executeWithUseOfUnitOfWork(input);
      } catch (e) {
        const { caller } = store;
        if (e instanceof OptimisticLockVersionMismatchError) {
          this.logger.warning(
            'Произошла оптимистичная блокировка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), requestDod: input, caller },
          );
        } else if (e instanceof DatabaseObjectSavingError) {
          if (store.databaseErrorRestartAttempts === 0) {
            this.logger.error(
              'Произошла ошибка БД, перезапуск не помог, прокидываем ошибку дальше...',
              { errorDesctiption: String(e), requestDod: input, caller },
            );
            throw e;
          }
          this.logger.warning(
            'Произошла ошибка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), requestDod: input, caller },
          );
          store.databaseErrorRestartAttempts -= 1;
        } else {
          throw e;
        }
      }
    }
  }

  protected async executeWithUseOfUnitOfWork(
    input: S_PARAMS['input'],
  ): Promise<ServiceResult<S_PARAMS>> {
    const store = storeDispatcher.getStoreOrExepction();
    const db = store.moduleResolver.getDatabase();
    const unitOfWorkId = await db.startTransaction();
    store.unitOfWorkId = unitOfWorkId;

    try {
      const res = await super.execute(input);
      if (res.isSuccess()) await db.commit(unitOfWorkId);
      else await db.rollback(unitOfWorkId);

      store.unitOfWorkId = undefined;
      return res;
    } catch (e) {
      await db.rollback(unitOfWorkId);
      store.unitOfWorkId = undefined;
      throw e;
    }
  }
}
