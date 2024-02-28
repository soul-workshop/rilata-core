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

export type ARDT<ATTRS extends DTO, META extends DomainMeta<string> = DomainMeta<string>> = {
  attrs: ATTRS,
  meta: META,
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
  NAME extends string,
  LOCALE extends Locale<NAME>,
  TYPE extends ErrorType = 'domain-error'
> = {
  locale: LOCALE,
  name: NAME,
  meta: {
    domainType: 'error',
    errorType: TYPE,
  }
}

export type GeneralErrorDod = ErrorDod<string, Locale, ErrorType>;

export type EventDod<
  ATTRS extends DomainAttrs,
  NAME extends string,
  ARDTF extends AggregateDataTransfer | ARDT<DTO> | undefined,
  CALLER extends Caller = Caller
> = {
  attrs: ATTRS,
  meta: {
    eventId: UuidType,
    requestId: UuidType,
    name: NAME,
    moduleName: string,
    domainType: 'event',
    created: number,
  }
  caller: CALLER,
  aRootAttrs: ARDTF,
}

export type GeneralEventDod = EventDod<
  DomainAttrs, string, AggregateDataTransfer | ARDT<DTO> | undefined
>;

export type RequestDod <ATTRS extends DTO, NAME extends string> = {
  meta: {
    name: NAME,
    requestId: UuidType,
    domainType: 'request',
  },
  attrs: ATTRS,
}

export type GeneralRequestDod = RequestDod<DTO, string>;
