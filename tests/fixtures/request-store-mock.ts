/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidUtility } from '../../src/core/utils/uuid/uuid-utility.js';
import { GeneralModuleResolver } from '../../src/api/module/types.js';
import { WebReqeustStorePayload } from '../../src/api/request-store/types.js';
import { requestStoreDispatcher } from '../../src/api/request-store/request-store-dispatcher.js';

export function requestStoreMock(
  store: Partial<WebReqeustStorePayload> & { moduleResolver: GeneralModuleResolver},
): void {
  const storePayload: WebReqeustStorePayload = {
    caller: store.caller ?? {
      type: 'DomainUser',
      userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
    },
    moduleResolver: store.moduleResolver,
    logger: store.moduleResolver.getLogger(),
    requestId: store.requestId ?? uuidUtility.getNewUUID(),
    databaseErrorRestartAttempts: store.databaseErrorRestartAttempts ?? 1,
    unitOfWorkId: store.unitOfWorkId,
    serviceName: store.serviceName ?? 'AddingUserService',
    moduleName: store.moduleName ?? 'SubjectModule',
  };

  requestStoreDispatcher.setRequestStore({
    getStore() {
      return storePayload;
    },

    run <F, Fargs extends unknown[]>(
      s: WebReqeustStorePayload,
      fn: (...args: Fargs) => F,
      ...args: Fargs
    ): F {
      throw Error('Для тестовых моков данный метод не должен вызываться. При необходимости используйте настоящий store.');
    },
  });
}
