import { Logger } from '../../common/logger/logger';
import { Result } from '../../common/result/types';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { GeneralModuleResolver } from '../module/types';

export abstract class Service<R extends GeneralModuleResolver> {
  abstract aRootName: string;

  abstract serviceName: string;

  abstract inputDodName: string;

  abstract moduleName: string;

  protected get moduleResolver(): R {
    return storeDispatcher.getStoreOrExepction().moduleResolver as R;
  }

  protected get logger(): Logger {
    return this.moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<Result<unknown, unknown>>
}
