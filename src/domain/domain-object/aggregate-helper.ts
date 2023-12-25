import { Caller } from '../../app/caller';
import { ModuleResolver } from '../../app/resolves/module-resolver';
import { UuidType } from '../../common/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { uuidUtility } from '../../common/utils/uuid/uuid-utility';
import { OutputAggregateDataTransfer, GeneralARDParams } from '../domain-object-data/aggregate-data-types';
import { GeneralEventDod } from '../domain-object-data/common-types';
import {
  GetARParamsAggregateName, GetARParamsEventAttrs, GetARParamsEventNames,
  GetARParamsEvents, GetNoOutKeysFromARParams,
} from '../domain-object-data/type-functions';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<PARAMS extends GeneralARDParams> {
  private domainEvents: GetARParamsEvents<PARAMS>[] = [];

  constructor(
    protected attrs: PARAMS['attrs'],
    protected aRootName: GetARParamsAggregateName<PARAMS>,
    protected version: number,
    protected outputExcludeAttrs: GetNoOutKeysFromARParams<PARAMS>,
    protected resolver: ModuleResolver,
  ) {
    this.validateVersion();
  }

  getMeta(): PARAMS['meta'] {
    return {
      name: this.aRootName,
      domainType: 'aggregate',
      version: this.version,
    };
  }

  getOutput(): OutputAggregateDataTransfer<PARAMS> {
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

  registerDomainEvent<EVENT extends GetARParamsEvents<PARAMS>>(
    eventName: GetARParamsEventNames<EVENT>,
    eventAttrs: GetARParamsEventAttrs<EVENT>,
    actionId: UuidType,
    caller: Caller,
  ): void {
    const event: GeneralEventDod = {
      attrs: eventAttrs,
      meta: {
        eventId: uuidUtility.getNewUUID(),
        actionId,
        name: eventName,
        moduleName: this.resolver.getModulName(),
        domainType: 'event',
      },
      caller,
      aRootAttrs: this.getOutput(),
    };
    this.domainEvents.push(event as GetARParamsEvents<PARAMS>);
  }

  getDomainEvents(): GetARParamsEvents<PARAMS>[] {
    return this.domainEvents;
  }

  cleanDomainEvents(): void {
    this.domainEvents = [];
  }

  private validateVersion(): void {
    if (typeof this.version !== 'number' || this.version < 0) {
      this.resolver.getLogger().error(
        `not valid version for aggregate ${this.aRootName}`,
        { aRootName: this.aRootName, version: this.version },
      );
    }
  }
}
