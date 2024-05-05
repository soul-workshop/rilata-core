import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../../common/exeptions';
import { Logger } from '../../../common/logger/logger';
import { storeDispatcher } from '../../async-store/store-dispatcher';
import { GeneralModuleResolver } from '../../module/types';

export abstract class TransactionStrategy {
  protected resolver!: GeneralModuleResolver;

  protected logger!: Logger;

  init(resolver: GeneralModuleResolver): void {
    this.resolver = resolver;
    this.logger = resolver.getLogger();
  }

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
        await this.executeWithTransaction(service, input);
      } catch (e) {
        const { caller } = store;
        if (e instanceof OptimisticLockVersionMismatchError) {
          this.logger.warning(
            'Произошла оптимистичная блокировка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), input, caller },
          );
        } else if (e instanceof DatabaseObjectSavingError) {
          if (store.databaseErrorRestartAttempts === 0) {
            this.logger.error(
              'Произошла ошибка БД, перезапуск не помог, прокидываем ошибку дальше...',
              { errorDesctiption: String(e), input, caller },
            );
            throw e;
          }
          this.logger.warning(
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
}
