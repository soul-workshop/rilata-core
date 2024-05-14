import { Caller } from '../../app/caller';
import { UuidType } from '../../common/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { GeneralARDParams } from '../domain-data/params-types';
import { OutputAggregateDataTransfer, GeneralEventDod } from '../domain-data/domain-types';
import {
  GetARParamsAggregateName, GetARParamsEventAttrs, GetARParamsEventNames,
  GetARParamsEvents, GetNoOutKeysFromARParams,
} from '../domain-data/type-functions';
import { storeDispatcher } from '../../app/async-store/store-dispatcher';
import { Logger } from '../../common/logger/logger';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<PARAMS extends GeneralARDParams> {
  private domainEvents: GetARParamsEvents<PARAMS>[] = [];

  constructor(
    protected attrs: PARAMS['attrs'],
    protected aRootName: GetARParamsAggregateName<PARAMS>,
    protected idName: keyof PARAMS['attrs'] & string,
    protected version: number,
    protected outputExcludeAttrs: GetNoOutKeysFromARParams<PARAMS>,
    protected logger: Logger,
  ) {
    this.validateVersion();
  }

  getMeta(): PARAMS['meta'] {
    return {
      name: this.aRootName,
      idName: this.idName,
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

  getId(): string {
    return this.attrs[this.idName];
  }

  getName(): string {
    return this.aRootName;
  }

  getLogger(): Logger {
    return this.logger;
  }

  registerEvent<EVENT extends GetARParamsEvents<PARAMS>>(
    eventName: GetARParamsEventNames<EVENT>,
    eventAttrs: GetARParamsEventAttrs<EVENT>,
    requestId?: UuidType,
    caller?: Caller,
  ): void {
    const event: GeneralEventDod = dodUtility.getEventDod(
      eventName, eventAttrs, this.getOutput(), { requestId, caller },
    );
    this.domainEvents.push(event as GetARParamsEvents<PARAMS>);
  }

  getEvents(): GetARParamsEvents<PARAMS>[] {
    return this.domainEvents;
  }

  cleanEvents(): void {
    this.domainEvents = [];
  }

  private validateVersion(): void {
    if (typeof this.version !== 'number' || this.version < 0) {
      throw this.logger.error(
        `not valid version for aggregate ${this.aRootName}`,
        { aRootName: this.aRootName, version: this.version },
      );
    }
  }
}
