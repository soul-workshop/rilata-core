import { Caller } from '../../app/caller';
import { UuidType } from '../../common/types';
import { DTO } from '../dto';
import { Locale } from '../locale';
import { GeneralARDParams } from './params-types';

/** Domain Object Data */
export type DomainAttrs = DTO;

export type DomainType = 'aggregate' | 'event' | 'error';

export type ErrorType = 'domain-error' | 'app-error';

export type DomainMeta<
  NAME extends string,
  ID_NAME extends string,
> = {
  name: NAME,
  idName: ID_NAME,
  domainType: 'aggregate',
  version: number,
}

export type ARDT<ATTRS extends DTO, META extends DomainMeta<string, keyof ATTRS & string>> = {
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
  ARDTF extends ARDT<DTO, DomainMeta<string, string>>,
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
  aRoot: ARDTF,
}

export type GeneralEventDod = EventDod<
  DomainAttrs, string, ARDT<DTO, DomainMeta<string, string>>
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
