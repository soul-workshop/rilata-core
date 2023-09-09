import { Caller } from '../../app/caller';
import { ExcludeDeepDtoAttrs, GetDomainAttrsDotKeys } from '../../common/type-functions';
import { UuidType } from '../../common/types';
import { DTO } from '../dto';
import { Locale } from '../locale';
import { AggregateRootDataTransfer, GeneralARDTransfer } from './aggregate-data-types';

type Name = string;

/** Domain Object Data */
export type DomainAttrs = DTO;

export type ObjectType = 'value-object' | 'entity' | 'aggregate';

export type DomainType = 'domain-object' | 'event' | 'error';

export type ErrorType = 'domain-error' | 'app-error';

export type DomainMeta<
  ATTRS extends DomainAttrs,
  NAME extends string,
  NO_OUT extends GetDomainAttrsDotKeys<ATTRS>,
  D_TYPE extends DomainType = 'domain-object',
  O_TYPE extends ObjectType = 'aggregate',
> = {
  name: NAME,
  domainType: D_TYPE,
  objectType: O_TYPE,
  noOutput?: NO_OUT,
  // version?: number,
}

export type GeneralDomainMeta = DomainMeta<
  DomainAttrs, string, GetDomainAttrsDotKeys<DomainAttrs>, DomainType, ObjectType
>;

export type ErrorDod<
  LOCALE extends Locale,
  NAME extends string,
  TYPE extends ErrorType = 'domain-error'
> = {
  locale: LOCALE,
  name: NAME,
  domainType: 'error',
  errorType: TYPE,
}

export type GeneralErrorDod = ErrorDod<Locale, Name, ErrorType>;

export type EventDod<ATTRS extends DomainAttrs, NAME extends string> = {
  attrs: ATTRS,
  name: NAME,
  domainType: 'event',
  eventId: UuidType,
  caller: Caller,
}

export type GeneralEventDod = EventDod<DomainAttrs, Name>;

export type UseCaseCommandDod<ATTRS extends DomainAttrs, NAME extends string> = {
  attrs: ATTRS,
  name: NAME,
  commandId?: UuidType,
}

export type GeneralCommandDod = UseCaseCommandDod<DTO, string>;

export type GetDomainAttrs<D extends GeneralARDTransfer> =
  D extends AggregateRootDataTransfer<infer A, infer _> ? A : never;

export type OutputDA<
  ATTRS extends DomainAttrs,
  EXC extends GetDomainAttrsDotKeys<ATTRS>
> = ExcludeDeepDtoAttrs<ATTRS, EXC>;

export type OutputDOD<
  DATA extends AggregateRootDataTransfer<DomainAttrs, GeneralDomainMeta>,
  EXC extends GetDomainAttrsDotKeys<DATA['attrs']>
> = ExcludeDeepDtoAttrs<DATA['attrs'], EXC> extends infer ATTRS
  ? ATTRS extends DTO
    ? AggregateRootDataTransfer<
        ATTRS,
        NonNullable<DATA['meta']>,
        NonNullable<DATA['actions']>
      >
    : ATTRS
  : never
