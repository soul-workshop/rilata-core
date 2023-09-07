import { UuidType, UserId } from '../../../common/types';
import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-types';
import { DomainAttrs } from '../../../domain/domain-object-data/common-types';
import { GetARName } from '../../../domain/domain-object-data/type-functions';

export interface InstanceActionable<
  AR_PARAMS extends GeneralARDParams, AC_NAME extends GetARName<AR_PARAMS>
> {
  actionType: 'instance'

  aggregateName: GetARName<AR_PARAMS>;

  actionName: AC_NAME;

  getAction(
    userId: UserId,
    instance: UuidType | DomainAttrs,
    args: unknown[],
  ): Record<AC_NAME, boolean>
}
