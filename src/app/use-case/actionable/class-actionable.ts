import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { GetARParamsActionNames } from '../../../domain/domain-object-data/type-functions';
import { Actionable } from './actionable';

export interface ClassActionable<
  AR_PARAMS extends GeneralARDParams,
  AC_NAME extends GetARParamsActionNames<AR_PARAMS>,
> extends Actionable<AR_PARAMS, AC_NAME> {
  actionType: 'class';
}
