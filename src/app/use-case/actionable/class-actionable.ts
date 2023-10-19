import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { GetARParamsActionNames, GetARParamsAggregateName, GetARParmasActionType } from '../../../domain/domain-object-data/type-functions';
import { Actionable } from './actionable';

export interface ClassActionable<
  AR_PARAMS extends GeneralARDParams,
> extends Actionable {
  readonly actionType: GetARParmasActionType<AR_PARAMS>;

  readonly aggregateName: GetARParamsAggregateName<AR_PARAMS>;

  readonly actionName: GetARParamsActionNames<AR_PARAMS>;

  actionIsAvailable(userId: string): Promise<boolean>
}
