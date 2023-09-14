import { UserId, UuidType } from '../../../common/types';
import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { DomainAttrs } from '../../../domain/domain-object-data/common-types';
import { GetARParamsActionNames, GetARParamsAggregateName, GetARParmasActionType } from '../../../domain/domain-object-data/type-functions';
import { Actionable } from './actionable';

export interface InstanceActionable<
  AR_PARAMS extends GeneralARDParams,
> extends Actionable {
  readonly actionType: GetARParmasActionType<AR_PARAMS>;

  readonly aggregateName: GetARParamsAggregateName<AR_PARAMS>;

  readonly actionName: GetARParamsActionNames<AR_PARAMS>;

  actionIsAvailable(userId: UserId, instance: UuidType | DomainAttrs): Promise<boolean>
}
