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

export type MutationType = 'read-model-object' | 'command-model-object';

export type CommandType = 'domain-command' | 'usecase-command';

export type DomainMeta = {
  name: string,
  version?: number,
  objectType?: ObjectType,
  domainType?: DomainType,
  errorType?: ErrorType,
  mutationType?: MutationType,
  noOutput?: GetDomainAttrsDotKeys<DTO>,
}

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
}

export type GeneralEventDod = EventDod<DomainAttrs, Name>;

export type CommandDod<ATTRS extends DomainAttrs, NAME extends string, TYPE extends CommandType> = {
  attrs: ATTRS,
  name: NAME,
  domainType: TYPE,
  commandId?: UuidType,
}

export type GeneralCommandDod = CommandDod<DTO, string, CommandType>;

export type GetDomainAttrs<D extends GeneralARDTransfer> =
  D extends AggregateRootDataTransfer<infer A, infer _> ? A : never;

export type OutputDA<
  ATTRS extends DomainAttrs,
  EXC extends GetDomainAttrsDotKeys<ATTRS>
> = ExcludeDeepDtoAttrs<ATTRS, EXC>;

export type OutputDOD<
  DATA extends AggregateRootDataTransfer<DomainAttrs, DomainMeta>,
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
