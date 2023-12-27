import { Logger } from '../../common/logger/logger';
import { Result } from '../../common/result/types';
import { ModuleResolver } from '../resolves/module-resolver';

export abstract class Service {
  protected abstract aRootName: string;

  protected abstract name: string;

  protected moduleResolver!: ModuleResolver;

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<Result<unknown, unknown>>

  getAggregateName(): string {
    return this.aRootName;
  }

  getName(): string {
    return this.name;
  }
}
