import { AssertionException } from '../../common/exeptions';
import { StorePayload, ThreadStore } from './types';

/** обертка над AsyncLocalStorage, чтобы не тянуть библиотеки nodeJs во фронт. */
class AsyncLocalStorageDispatcher<T extends StorePayload> {
  private asyncLocalStorage!: ThreadStore<T>;

  setThreadStore(asyncLocalStorage: ThreadStore<T>): void {
    this.asyncLocalStorage = asyncLocalStorage;
  }

  getThreadStore(): ThreadStore<T> {
    return this.asyncLocalStorage;
  }

  getStoreOrExepction(): T {
    const store = this.asyncLocalStorage.getStore();
    if (!store) throw new AssertionException('not found async local storage store');
    return store;
  }
}

export const storeDispatcher = new AsyncLocalStorageDispatcher<StorePayload>();
