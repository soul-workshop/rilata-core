import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../../common/exeptions';
import { Logger } from '../../../common/logger/logger';
import { storeDispatcher } from '../../async-store/store-dispatcher';

export abstract class TransactionStrategy {
  /** Ответственнен за выполнение транзацкии */
  protected abstract executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN) => RET | Promise<RET> }
  >(service: S, input: IN): RET | Promise<RET>

  /** Запускает доменный слой, перезапускает в случае получения ошибок БД. */
  async executeDatabaseScope<
    IN, RET, S extends { runDomain:(input: IN) => RET | Promise<RET> }
  >(service: S, input: IN): Promise<RET> {
    const store = storeDispatcher.getStoreOrExepction();
    // разрешить перезапуститься 1 раз, если возникла ошибка в БД.
    store.databaseErrorRestartAttempts = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.executeWithTransaction(service, input) as RET | Promise<RET>;
        return result;
      } catch (e) {
        const { caller } = store;
        if (e instanceof OptimisticLockVersionMismatchError) {
          this.getLogger().warning(
            'Произошла оптимистичная блокировка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), input, caller },
          );
        } else if (e instanceof DatabaseObjectSavingError) {
          if (store.databaseErrorRestartAttempts === 0) {
            this.getLogger().error(
              'Произошла ошибка БД, перезапуск не помог, прокидываем ошибку дальше...',
              { errorDesctiption: String(e), input, caller },
              e,
            );
            throw e;
          }
          this.getLogger().warning(
            'Произошла ошибка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), input, caller },
          );
          store.databaseErrorRestartAttempts -= 1;
        } else {
          throw e;
        }
      }
    }
  }

  protected getLogger(): Logger {
    return storeDispatcher.getStoreOrExepction().moduleResolver.getLogger();
  }
}
