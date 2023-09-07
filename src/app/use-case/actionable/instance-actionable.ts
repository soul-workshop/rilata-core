import { UuidType, UserId } from '../../../common/types';
import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { GetARParamsActionNames, GetARParamsAttrs } from '../../../domain/domain-object-data/type-functions';
import { Actionable } from './actionable';

export interface InstanceActionable<
  AR_PARAMS extends GeneralARDParams, AC_NAME extends GetARParamsActionNames<AR_PARAMS>
> extends Actionable <AR_PARAMS, AC_NAME> {
  getAction(
    userId: UserId,
    instance: UuidType | GetARParamsAttrs<AR_PARAMS>,
    args: unknown[],
  ): Record<AC_NAME, boolean>
}
