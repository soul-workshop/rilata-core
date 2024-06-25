import { Logger } from '../../core/logger/logger.js';
import { GeneralModuleResolver } from '../module/types.js';
import { requestStoreDispatcher } from '../request-store/request-store-dispatcher.js';

export abstract class Service<R extends GeneralModuleResolver> {
  abstract aRootName: string;

  abstract serviceName: string;

  abstract handleName: string;

  abstract moduleName: string;

  protected get moduleResolver(): R {
    return requestStoreDispatcher.getPayload().moduleResolver as R;
  }

  protected get logger(): Logger {
    return this.moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<unknown>
}
