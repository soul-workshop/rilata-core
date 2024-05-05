import { Logger } from '../../common/logger/logger';
import { Result } from '../../common/result/types';
import { GeneralModuleResolver } from '../module/types';

export abstract class Service<R extends GeneralModuleResolver> {
  abstract aRootName: string;

  abstract serviceName: string;

  protected moduleResolver!: R;

  protected logger!: Logger;

  init(moduleResolver: R): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<Result<unknown, unknown>>
}
