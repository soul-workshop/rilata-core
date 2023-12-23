import { Logger } from '../../common/logger/logger';
import { ExcludeDeepDtoAttrs } from '../../common/type-functions';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { AggregateRootDataTransfer, GeneralARDParams } from '../domain-object-data/aggregate-data-types';
import { GetARParamsAggregateName, GetARParamsEvents, GetNoOutKeysFromARParams } from '../domain-object-data/type-functions';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<PARAMS extends GeneralARDParams> {
  private domainEvents: GetARParamsEvents<PARAMS>[] = [];

  constructor(
    protected attrs: PARAMS['attrs'],
    protected aRootName: GetARParamsAggregateName<PARAMS>,
    protected version: number,
    protected outputExcludeAttrs: GetNoOutKeysFromARParams<PARAMS>,
    protected logger: Logger,
  ) {
    this.validateVersion();
  }

  getMeta(): PARAMS['meta'] {
    return {
      name: this.aRootName,
      domainType: 'domain-object',
      objectType: 'aggregate',
    };
  }

  getOutput(): AggregateRootDataTransfer<
    // @ts-ignore
    ExcludeDeepDtoAttrs<PARAMS['attrs'], GetNoOutKeysFromARParams<PARAMS>>,
    PARAMS['meta'] > {
    return {
      // @ts-ignore
      attrs: dtoUtility.excludeDeepAttrs(this.attrs, this.outputExcludeAttrs),
      meta: this.getMeta(),
    };
  }

  getVersion(): number {
    return this.version;
  }

  getName(): string {
    return this.aRootName;
  }

  registerDomainEvent(event: GetARParamsEvents<PARAMS>): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): GetARParamsEvents<PARAMS>[] {
    return this.domainEvents;
  }

  cleanDomainEvents(): void {
    this.domainEvents = [];
  }

  private validateVersion(): void {
    if (typeof this.version !== 'number' || this.version < 0) {
      this.logger.error(
        `not valid version for aggregate ${this.aRootName}`,
        { aRootName: this.aRootName, version: this.version },
      );
    }
  }
}
