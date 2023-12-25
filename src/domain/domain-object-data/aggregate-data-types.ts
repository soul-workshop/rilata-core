/* eslint-disable @typescript-eslint/no-unused-vars */
import { Result } from '../../common/result/types';
import { ExcludeDeepDtoAttrs, GetDtoKeysByDotNotation } from '../../common/type-functions';
import { GetNoOutKeysFromARParams } from '../domain-object-data/type-functions';
import { DTO } from '../dto';
import {
  DomainAttrs, DomainMeta, GeneralErrorDod, GeneralEventDod,
} from './common-types';

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

export type DomainResult<AC_PARAMS extends GeneralActionParams> =
  Result<AC_PARAMS['errors'], AC_PARAMS['success']>;

/** полное описание доменного агрегата */
export type AggregateRootDataParams<
  ATTRS extends DomainAttrs,
  META extends DomainMeta<string>,
  ACTIONS extends GeneralActionParams,
  NO_OUT_KEYS extends GetDtoKeysByDotNotation<ATTRS>[]
> = {
  attrs: ATTRS,
  meta: META,
  actions: ACTIONS,
}

export type GeneralARDParams = AggregateRootDataParams<
  DomainAttrs, DomainMeta<string>, GeneralActionParams, GetDtoKeysByDotNotation<DTO>[]
>;

export type UserActions = Record<string, boolean>;

export type AggregateDataTransfer = {
  attrs: unknown,
  meta: DomainMeta<string>,
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
