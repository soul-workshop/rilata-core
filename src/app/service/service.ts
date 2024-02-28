import { Logger } from '../../common/logger/logger';
import { Result } from '../../common/result/types';
import { GeneralModuleResolver } from '../module/types';

export abstract class Service {
  protected abstract aRootName: string;

  abstract serviceName: string;

  protected moduleResolver!: GeneralModuleResolver;

  protected logger!: Logger;

  init(moduleResolver: GeneralModuleResolver): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<Result<unknown, unknown>>

  getAggregateName(): string {
    return this.aRootName;
  }
}
