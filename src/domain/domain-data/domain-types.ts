import { Caller } from '../../app/caller';
import { UuidType } from '../../common/types';
import { DTO } from '../dto';
import { Locale } from '../locale';
import { GeneralARDParams } from './params-types';

type Name = string;

/** Domain Object Data */
export type DomainAttrs = DTO;

export type DomainType = 'aggregate' | 'event' | 'error';

export type ErrorType = 'domain-error' | 'app-error';

export type DomainMeta<
  NAME extends string,
> = {
  name: NAME,
  domainType: 'aggregate',
  version: number,
}

export type AggregateDataTransfer = {
  attrs: unknown,
  meta: DomainMeta<string>,
}

/** формат агрегата для передачи данных  */
export type OutputAggregateDataTransfer<
  PARAMS extends GeneralARDParams
> = {
  // @ts-ignore
  attrs: ExcludeDeepDtoAttrs<PARAMS['attrs'], GetNoOutKeysFromARParams<PARAMS>>,
  meta: PARAMS['meta'],
}

export type GeneralOutputAggregateDataTransfer = OutputAggregateDataTransfer<GeneralARDParams>;

export type ErrorDod<
  LOCALE extends Locale,
  NAME extends string,
  TYPE extends ErrorType = 'domain-error'
> = {
  locale: LOCALE,
  name: NAME,
  meta: {
    domainType: 'error',
    errorType: TYPE,
  }
}

export type GeneralErrorDod = ErrorDod<Locale, Name, ErrorType>;

export type EventDod<ATTRS extends DomainAttrs, NAME extends string> = {
  attrs: ATTRS,
  meta: {
    eventId: UuidType,
    actionId: UuidType,
    name: NAME,
    moduleName: string,
    domainType: 'event',
  }
  caller: Caller,
  aRootAttrs: AggregateDataTransfer,
}

export type GeneralEventDod = EventDod<DomainAttrs, string>;

export type ActionDod = {
  meta: {
    name: string,
    actionId: UuidType,
    domainType: 'action',
  },
  attrs: DTO,
}
