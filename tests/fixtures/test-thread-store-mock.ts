import { StorePayload } from '../../src/app/async-store/types';
import { Caller } from '../../src/app/caller';
import { UuidType } from '../../src/common/types';
import { TestResolverMock } from './test-resolver-mock';
import { storeDispatcher } from '../../src/app/async-store/store-dispatcher';

const resolver = new TestResolverMock();

export function getTestStoreDispatcher(actionId: UuidType, caller?: Caller):
typeof storeDispatcher {
  const storePayload: StorePayload = {
    caller: caller ?? {
      type: 'DomainUser',
      userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
    },
    moduleResolver: resolver,
    actionId,
  };

  storeDispatcher.setThreadStore({
    run: () => {
      throw new Error('Method not implemented.');
    },
    getStore: () => storePayload,
  });

  return storeDispatcher;
}
