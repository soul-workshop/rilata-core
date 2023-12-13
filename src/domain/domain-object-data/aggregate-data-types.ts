import { Result } from '../../common/result/types';
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
  AC_PARAMS extends ActionParams<unknown, infer SCSS, infer ERRORS, unknown>
    ? Result<ERRORS, SCSS>
    : never;

/** полное описание доменного агрегата */
export type AggregateRootDataParams<
  ATTRS extends DomainAttrs,
  META extends GeneralDomainMeta,
  ACTIONS extends GeneralActionParams,
> = {
  attrs: ATTRS,
  meta: META,
  actions: ACTIONS,
}

export type GeneralARDParams = AggregateRootDataParams<
  DomainAttrs, GeneralDomainMeta, GeneralActionParams
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
