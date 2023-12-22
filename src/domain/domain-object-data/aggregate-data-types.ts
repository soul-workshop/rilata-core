/* eslint-disable @typescript-eslint/no-unused-vars */
import { Result } from '../../common/result/types';
import { GetDtoKeysByDotNotation } from '../../common/type-functions';
import { DTO } from '../dto';
import { DomainAttrs, GeneralDomainMeta } from './common-types';

/** полное описание одного из действий агрегата */
export type ActionParams<
  CMD, SCSS, ERRORS, EVENT
> = {
  command: CMD,
  success: SCSS,
  errors: ERRORS,
  events: EVENT,
}

export type GeneralActionParams = ActionParams<
  unknown, unknown, unknown, unknown
>;

export type DomainResult<AC_PARAMS extends GeneralActionParams> =
  Result<AC_PARAMS['errors'], AC_PARAMS['success']>;

/** полное описание доменного агрегата */
export type AggregateRootDataParams<
  ATTRS extends DomainAttrs,
  META extends GeneralDomainMeta,
  ACTIONS extends GeneralActionParams,
  NO_OUT_KEYS extends GetDtoKeysByDotNotation<ATTRS>[]
> = {
  attrs: ATTRS,
  meta: META,
  actions: ACTIONS,
}

export type GeneralARDParams = AggregateRootDataParams<
  DomainAttrs, GeneralDomainMeta, GeneralActionParams, GetDtoKeysByDotNotation<DTO>[]
>;

export type UserActions = Record<string, boolean>;

/** формат агрегата для передачи данных  */
export type AggregateRootDataTransfer<
  D extends DomainAttrs,
  M extends GeneralDomainMeta,
  A extends UserActions = UserActions,
> = {
  attrs: D,
  meta?: M,
  actions?: A,
}

export type GeneralARDTransfer = AggregateRootDataTransfer<DomainAttrs, GeneralDomainMeta>;

/** передача всех данных об агрегате */
export type FullAggregateRootDataTransfer<D extends GeneralARDTransfer> = {
  classActions?: UserActions,
  instances: D[],
}

export type GeneralFullARDTransfer = FullAggregateRootDataTransfer<GeneralARDTransfer>;
