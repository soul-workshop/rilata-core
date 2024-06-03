import { Logger } from '../../core/logger/logger';
import { Result } from '../../core/result/types';
import { GeneralModuleResolver } from '../module/types';
import { requestStoreDispatcher } from '../request-store/request-store-dispatcher';

export abstract class Service<R extends GeneralModuleResolver> {
  abstract aRootName: string;

  abstract serviceName: string;

  abstract inputDodName: string;

  abstract moduleName: string;

  protected get moduleResolver(): R {
    return requestStoreDispatcher.getPayload().moduleResolver as R;
  }

  protected get logger(): Logger {
    return this.moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<Result<unknown, unknown>>
}
