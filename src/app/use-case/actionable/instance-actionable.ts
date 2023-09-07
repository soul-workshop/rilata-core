import { UserId, UuidType } from '../../../common/types';
import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { DomainAttrs } from '../../../domain/domain-object-data/common-types';
import { GetARParamsActionNames } from '../../../domain/domain-object-data/type-functions';
import { Actionable } from './actionable';

export interface InstanceActionable<
  AR_PARAMS extends GeneralARDParams,
  AC_NAME extends GetARParamsActionNames<AR_PARAMS>,
> extends Actionable<AR_PARAMS, AC_NAME> {
  actionType: 'instance';

  getAction(
    userId: UserId,
    instance: UuidType | DomainAttrs,
    args: unknown[],
  ): Promise<Record<AC_NAME, boolean>>
}
