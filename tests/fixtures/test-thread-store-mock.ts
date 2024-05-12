/* eslint-disable @typescript-eslint/no-unused-vars */
import { StorePayload } from '../../src/app/async-store/types';
import { storeDispatcher } from '../../src/app/async-store/store-dispatcher';
import { uuidUtility } from '../../src/common/utils/uuid/uuid-utility';
import { GeneralModuleResolver } from '../../src/app/module/types';

export function setAndGetTestStoreDispatcher(
  store: Partial<StorePayload> & { moduleResolver: GeneralModuleResolver},
):
typeof storeDispatcher {
  const storePayload: StorePayload = {
    caller: store.caller ?? {
      type: 'DomainUser',
      userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
    },
    moduleResolver: store.moduleResolver,
    requestId: store.requestId ?? uuidUtility.getNewUUID(),
    databaseErrorRestartAttempts: store.databaseErrorRestartAttempts ?? 1,
    unitOfWorkId: store.unitOfWorkId,
    serviceName: store.serviceName ?? 'AddingUserService',
    moduleName: store.moduleName ?? 'SubjectModule',
  };

  storeDispatcher.setThreadStore({
    getStore: () => storePayload,

    run <F, Fargs extends unknown[]>(
      s: StorePayload,
      fn: (...args: Fargs) => F,
      ...args: Fargs
    ): F {
      throw Error('для запросов входящих с уровня контроллера необходимо использовать настоящий store');
    },
  });

  return storeDispatcher;
}
