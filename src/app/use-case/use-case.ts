import { ModuleResolver } from '../../conf/module-resolver';
import { Logger } from '../../common/logger/logger';

export abstract class UseCase {
  protected abstract aRootName: string;

  protected abstract name: string;

  protected moduleResolver!: ModuleResolver;

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<unknown>

  getAggregateName(): string {
    return this.aRootName;
  }

  getName(): string {
    return this.name;
  }
}
