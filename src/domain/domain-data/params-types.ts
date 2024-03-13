import { Result } from '../../common/result/types';
import { GetDtoKeysByDotNotation } from '../../common/type-functions';
import { DTO } from '../dto';
import {
  DomainAttrs, DomainMeta, GeneralErrorDod, GeneralEventDod,
} from './domain-types';

/** полное описание одного из действий агрегата */
export type ActionParams<
  CMD, SCSS, ERRORS extends GeneralErrorDod, EVENTS extends GeneralEventDod[]
> = {
  command: CMD,
  success: SCSS,
  errors: ERRORS,
  events: EVENTS,
}

export type GeneralActionParams = ActionParams<
  unknown, unknown, GeneralErrorDod, GeneralEventDod[]
>;

/** полное описание доменного агрегата */
export type AggregateRootDataParams<
  ATTRS extends DomainAttrs,
  META extends DomainMeta<string, keyof ATTRS & string>,
  ACTIONS extends GeneralActionParams,
  NO_OUT_KEYS extends GetDtoKeysByDotNotation<ATTRS>[]
> = {
  attrs: ATTRS,
  meta: META,
  actions: ACTIONS,
  noOutKeys: NO_OUT_KEYS
}

export type GeneralARDParams = AggregateRootDataParams<
  DomainAttrs, DomainMeta<string, string>, GeneralActionParams, GetDtoKeysByDotNotation<DTO>[]
>;

export type DomainResult<AC_PARAMS extends GeneralActionParams> =
  Result<AC_PARAMS['errors'], AC_PARAMS['success']>;
