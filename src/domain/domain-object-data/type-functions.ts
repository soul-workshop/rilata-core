import { GeneralARDParams } from './aggregate-data-types';
import { EventDod } from './common-types';

export type GetARParamsAttrs<AR_PARAMS extends GeneralARDParams> = AR_PARAMS['attrs'];

export type GetARParamsEvents<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events']

export type GetARParamsEventNames<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events'] extends EventDod<infer _, infer NAME>
    ? NAME
    : never

export type GetARParamsAggregateName<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['meta']['name']

export type GetARParamsActionNames<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['name']

export type GetARParmasActionType<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['type']
