import { UserId } from '../../../common/types';
import { GeneralARDParams } from '../../../domain/domain-object-data/aggregate-types';
import { GetARName } from '../../../domain/domain-object-data/type-functions';

export interface ClassActionable<
  AR_PARAMS extends GeneralARDParams,
  AC_NAME extends GetARName<AR_PARAMS>,
> {
  /** доступно ли выполнение данного UseCase для пользователя */
  getAction(userId: UserId, args: unknown[]): Record<AC_NAME, boolean>

  getActionName(): AC_NAME;

  getAggregateName(): GetARName<AR_PARAMS>
}
