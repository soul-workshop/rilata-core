import { Caller } from '../../app/caller';
import { UuidType } from '../../common/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { uuidUtility } from '../../common/utils/uuid/uuid-utility';
import { GeneralARDParams } from '../domain-data/params-types';
import { OutputAggregateDataTransfer, GeneralEventDod } from '../domain-data/domain-types';
import {
  GetARParamsAggregateName, GetARParamsEventAttrs, GetARParamsEventNames,
  GetARParamsEvents, GetNoOutKeysFromARParams,
} from '../domain-data/type-functions';
import { storeDispatcher } from '../../app/async-store/store-dispatcher';
import { Logger } from '../../common/logger/logger';
import { AssertionException } from '../../common/exeptions';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<PARAMS extends GeneralARDParams> {
  private domainEvents: GetARParamsEvents<PARAMS>[] = [];

  constructor(
    protected aRootName: GetARParamsAggregateName<PARAMS>,
    protected attrs: PARAMS['attrs'],
    protected version: number,
    protected outputExcludeAttrs: GetNoOutKeysFromARParams<PARAMS>,
    protected logger: Logger,
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
    const store = storeDispatcher.getStoreOrExepction();
    const event: GeneralEventDod = {
      attrs: eventAttrs,
      meta: {
        eventId: uuidUtility.getNewUUID(),
        actionId,
        name: eventName,
        moduleName: store.moduleResolver.getModule().getModuleName(),
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
      const errStr = `not valid version for aggregate ${this.aRootName}`;
      this.logger.error(
        errStr,
        { aRootName: this.aRootName, version: this.version },
      );
      throw new AssertionException(errStr);
    }
  }
}
