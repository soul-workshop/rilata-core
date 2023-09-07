import { UserId, UuidType } from '../../../common/types';
import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { DomainAttrs } from '../../../domain/domain-object-data/common-types';
import { GetARParamsActionNames, GetARParamsAggregateName, GetARParmasActionType } from '../../../domain/domain-object-data/type-functions';
import { Actionable } from './actionable';

export interface InstanceActionable<
  AR_PARAMS extends GeneralARDParams,
  AC_NAME extends GetARParamsActionNames<AR_PARAMS>,
> extends Actionable {
  actionType: GetARParmasActionType<AR_PARAMS>;

  aggregateName: GetARParamsAggregateName<AR_PARAMS>;

  actionName: AC_NAME;

  getAction(userId: UserId, instance: UuidType | DomainAttrs): Promise<Record<AC_NAME, boolean>>
}
