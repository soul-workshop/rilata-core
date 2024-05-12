import { GeneralCommandServiceParams, ServiceResult } from '../types';
import { GeneralModuleResolver } from '../../module/types';
import { TransactionStrategy } from '../transaction-strategy/strategy';
import { BaseService } from '../base.service';

/** Сервис для обработки команд */
export abstract class CommandService<
  P extends GeneralCommandServiceParams, RES extends GeneralModuleResolver
> extends BaseService<P, RES> {
  protected abstract transactionStrategy: TransactionStrategy;

  protected executeService(input: P['input']): Promise<ServiceResult<P>> {
    return this.transactionStrategy.executeDatabaseScope(this, input);
  }
}
