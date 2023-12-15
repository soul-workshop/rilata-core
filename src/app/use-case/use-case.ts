import { ModuleResolver } from '../../conf/module-resolver';
import { Logger } from '../../common/logger/logger';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';
import { GetARParamsAggregateName } from '../../domain/domain-object-data/type-functions';

export abstract class UseCase<ARP extends GeneralARDParams> {
  protected abstract aggregateName: GetARParamsAggregateName<ARP>;

  protected abstract name: string;

  protected moduleResolver!: ModuleResolver;

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver): void {
    this.moduleResolver = moduleResolver;
    this.logger = moduleResolver.getLogger();
  }

  abstract execute(...args: unknown[]): Promise<unknown>

  getAggregateName(): string {
    return this.aggregateName;
  }

  getName(): string {
    return this.name;
  }
}
