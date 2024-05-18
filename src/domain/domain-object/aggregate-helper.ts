import { UuidType } from '../../common/types';
import { dtoUtility } from '../../common/utils/dto/dto-utility';
import { ARDT, GeneralArParams, GeneralEventDod } from '../domain-data/domain-types';
import { Logger } from '../../common/logger/logger';
import { Caller } from '../../app/controller/types';
import { dodUtility } from '../../common/utils/dod/dod-utility';
import { GetArrayType } from '../../common/type-functions';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<PARAMS extends GeneralArParams> {
  private domainEvents: PARAMS['events'] = [];

  constructor(
    protected attrs: PARAMS['attrs'],
    protected aRootName: PARAMS['meta']['name'],
    protected idName: keyof PARAMS['attrs'] & string,
    protected version: number,
    protected outputExcludeAttrs: PARAMS['noOutKeys'],
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

  // @ts-ignore
  getOutput(): ARDT<PARAMS['attrs'], PARAMS['meta'], PARAMS['noOutKeys']> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs = dtoUtility.excludeDeepAttrs(this.attrs, this.outputExcludeAttrs) as any;
    return {
      attrs,
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

  registerEvent<EVENTS extends GetArrayType<PARAMS['events']>>(
    eventName: EVENTS['meta']['name'],
    eventAttrs: EVENTS['attrs'],
    requestId?: UuidType,
    caller?: Caller,
  ): void {
    const event: GeneralEventDod = dodUtility.getEventDod(
      eventName, eventAttrs, this.getOutput() as EVENTS['aRoot'], { requestId, caller },
    );
    this.domainEvents.push(event as EVENTS);
  }

  getEvents(): PARAMS['events'] {
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
