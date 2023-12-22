/* eslint-disable @typescript-eslint/no-unused-vars */
import { AggregateRootDataParams, GeneralActionParams, GeneralARDParams } from './aggregate-data-types';
import { DomainAttrs, EventDod, GeneralDomainMeta } from './common-types';

export type GetARParamsAttrs<AR_PARAMS extends GeneralARDParams> = AR_PARAMS['attrs'];

export type GetARParamsEvents<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events'] extends Array<infer ARR_TYPE>
    ? ARR_TYPE
    : AR_PARAMS['actions']['events'];

export type GetARParamsEventNames<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events'] extends EventDod<infer _, infer NAME>
    ? NAME
    : never

export type GetARParamsActionParams<AR_PARAMS extends GeneralARDParams> = AR_PARAMS['actions']

export type GetARParamsAggregateName<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['meta']['name']

export type GetNoOutKeysFromARParams<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS extends AggregateRootDataParams<
    DomainAttrs, GeneralDomainMeta, GeneralActionParams, infer T
  >
    ? T
    : never
