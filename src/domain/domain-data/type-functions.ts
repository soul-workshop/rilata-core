/* eslint-disable @typescript-eslint/no-unused-vars */
import { AggregateRootDataParams, GeneralActionParams, GeneralARDParams } from './params-types';
import {
  DomainAttrs, DomainMeta, EventDod, GeneralARDT, GeneralEventDod,
} from './domain-types';
import { DTO } from '../dto';

export type GetARParamsAttrs<AR_PARAMS extends GeneralARDParams> = AR_PARAMS['attrs'];

export type GetARParamsEvents<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events'] extends Array<infer ARR_TYPE>
    ? ARR_TYPE extends GeneralEventDod
      ? ARR_TYPE
      : never
    : never;

export type GetARParamsEventNames<EVENT extends GeneralEventDod> =
  EVENT extends EventDod<infer NAME, string, string, DTO, GeneralARDT>
    ? NAME
    : never

export type GetARParamsEventAttrs<EVENT extends GeneralEventDod> =
  EVENT extends EventDod<string, string, string, infer ATTRS, GeneralARDT>
    ? ATTRS
    : never

export type GetARParamsActionParams<AR_PARAMS extends GeneralARDParams> = AR_PARAMS['actions']

export type GetARParamsAggregateName<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['meta']['name']

export type GetNoOutKeysFromARParams<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS extends AggregateRootDataParams<
    DomainAttrs, DomainMeta<string, string>, GeneralActionParams, infer T
  >
    ? T
    : never
