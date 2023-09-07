import { GeneralARDParams } from './aggregate-types';
import { EventDod } from './common-types';

export type GetDomainEvents<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events']

export type GetDomainEventNames<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['events'] extends EventDod<infer _, infer NAME>
    ? NAME
    : never

export type GetARName<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['meta']['name']

export type GetARActionNames<AR_PARAMS extends GeneralARDParams> =
  AR_PARAMS['actions']['name']
