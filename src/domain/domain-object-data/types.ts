import { ExcludeDeepDtoAttrs, GetDomainAttrsDotKeys } from '../../common/type-functions';
import { IdType, UuidType } from '../../common/types';
import { DTO } from '../dto';
import { Locale } from '../locale';

/** Domain Object Data */
export type DomainAttrs = DTO;

export type IdDomainAttrs = {
  id: IdType,
}

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

export type Actions = Record<string, boolean>;

export type DomainObjectData<
  D extends DomainAttrs,
  M extends DomainMeta = DomainMeta,
  A extends Actions = Actions,
> = {
  attrs: D,
  meta?: M,
  actions?: A,
}

export type GeneralDod = DomainObjectData<DomainAttrs>;

export type DomainFullData<D extends GeneralDod> = {
  classActions?: Actions,
  instances: D[],
}

export type GeneralDFD = DomainFullData<GeneralDod>;

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

export type GeneralErrorDod = ErrorDod<Locale, string, ErrorType>;

export type EventDod<ATTRS extends DomainAttrs, NAME extends string> = {
  attrs: ATTRS,
  name: NAME,
  domainType: 'event',
  eventId: UuidType,
}

export type GeneralEventDod = EventDod<DomainAttrs, string>;

export type CommandDod<ATTRS extends DomainAttrs, NAME extends string, TYPE extends CommandType> = {
  attrs: ATTRS,
  name: NAME,
  domainType: TYPE,
  commandId?: UuidType,
}

export type GeneralCommandDod = CommandDod<DTO, string, CommandType>;

export type GetDomainAttrs<D extends GeneralDod> =
  D extends DomainObjectData<infer A> ? A : never;

export type OutputDA<
  ATTRS extends DomainAttrs,
  EXC extends GetDomainAttrsDotKeys<ATTRS>
> = ExcludeDeepDtoAttrs<ATTRS, EXC>;

export type OutputDOD<
  DATA extends DomainObjectData<DomainAttrs>,
  EXC extends GetDomainAttrsDotKeys<DATA['attrs']>
> = ExcludeDeepDtoAttrs<DATA['attrs'], EXC> extends infer ATTRS
  ? ATTRS extends DTO
    ? DomainObjectData<
        ATTRS,
        NonNullable<DATA['meta']>,
        NonNullable<DATA['actions']>
      >
    : ATTRS
  : never
