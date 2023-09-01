import { ExcludeDeepDtoAttrs, GetDtoKeysByDotNotation } from '../../common/type-functions';
import { IdType, UuidType } from '../../common/types';
import { DTO } from '../dto';

/** Domain Object Data */
export type DomainAttrs = DTO;

export type IdDomainAttrs = {
  id: IdType,
}

export type ObjectType = 'value-object' | 'entity' | 'aggregate';

export type DomainType = 'domain-object' | 'event' | 'error';

export type ErrorType = 'domain-error' | 'app-error' | 'validation-error';

export type MutationType = 'read-model-object' | 'command-model-object';

export type DomainMeta = {
  name: string,
  objectType?: ObjectType,
  domainType?: DomainType,
  errorType?: ErrorType,
  mutationType?: MutationType,
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

export type GeneralDOD = DomainObjectData<DomainAttrs>;

export type DomainFullData<D extends GeneralDOD> = {
  classActions?: Actions,
  instances: D[],
}

export type GeneralDFD = DomainFullData<GeneralDOD>;

export type ErrorDOD<
  ATTRS extends DomainAttrs,
  NAME extends string,
  TYPE extends ErrorType = 'domain-error'
> = {
  attrs: ATTRS,
  meta: {
    name: NAME,
    domainType: 'error',
    errorType: TYPE,
  }
}

export type GeneralErrorDOD = ErrorDOD<DomainAttrs, string, ErrorType>;

export type EventDOD<ATTRS extends DomainAttrs, NAME extends string> = {
  attrs: ATTRS,
  meta: {
    name: NAME,
    domainType: 'event',
    eventId: UuidType,
  }
}

export type GeneralEventDOD = EventDOD<DomainAttrs, string>;

export type GetDomainAttrs<D extends GeneralDOD> =
  D extends DomainObjectData<infer A> ? A : never;

export type OutputDA<
  ATTRS extends DomainAttrs,
  EXC extends GetDtoKeysByDotNotation<ATTRS> | GetDtoKeysByDotNotation<ATTRS>[]
> = ExcludeDeepDtoAttrs<ATTRS, EXC>;

export type OutputDOD<
  DATA extends DomainObjectData<DomainAttrs>,
  EXC extends GetDtoKeysByDotNotation<DATA['attrs']> | GetDtoKeysByDotNotation<DATA['attrs']>[] | ReadonlyArray<GetDtoKeysByDotNotation<DATA['attrs']>>
> = ExcludeDeepDtoAttrs<DATA['attrs'], EXC> extends infer ATTRS
  ? ATTRS extends DTO
    ? DomainObjectData<
        ATTRS,
        NonNullable<DATA['meta']>,
        NonNullable<DATA['actions']>
      >
    : ATTRS
  : never
