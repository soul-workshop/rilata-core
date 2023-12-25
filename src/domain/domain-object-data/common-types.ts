/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import { Caller } from '../../app/caller';
import { UuidType } from '../../common/types';
import { DTO } from '../dto';
import { Locale } from '../locale';
import { AggregateDataTransfer } from './aggregate-data-types';

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

export type ErrorDod<
  LOCALE extends Locale,
  NAME extends string,
  TYPE extends ErrorType = 'domain-error'
> = {
  locale: LOCALE,
  meta: {
    name: NAME,
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
  body: DTO,
}
