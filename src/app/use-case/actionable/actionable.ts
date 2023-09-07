import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-data-types';
import { GetARParamsActionNames, GetARParamsAggregateName, GetARParmasActionType } from '../../../domain/domain-object-data/type-functions';

export interface Actionable<
  AR_PARAMS extends GeneralARDParams,
  AC_NAME extends GetARParamsActionNames<AR_PARAMS>,
> {
  actionType: GetARParmasActionType<AR_PARAMS>

  aggregateName: GetARParamsAggregateName<AR_PARAMS>;

  actionName: AC_NAME;

  getAction(userId: string, ...args: unknown[]): Promise<Record<AC_NAME, boolean>>
}
