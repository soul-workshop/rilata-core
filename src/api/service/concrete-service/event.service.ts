import { success } from '../../../core/result/success';
import { Result } from '../../../core/result/types';
import { BusMessageType } from '../../bus/types';
import { GeneralModuleResolver } from '../../module/types';
import { BaseService } from '../base.service';
import { TransactionStrategy } from '../transaction-strategy/strategy';
import { GeneralEventServiceParams, ServiceResult } from '../types';

export abstract class EventService<
  P extends GeneralEventServiceParams,
  RES extends GeneralModuleResolver
> extends BaseService<P, RES> {
  abstract busMessageType: BusMessageType;

  abstract eventModuleName: P['input']['meta']['moduleName'];

  abstract eventServiceName: P['input']['meta']['serviceName'];

  protected validator!: never;

  protected supportedCallers!: never;

  protected abstract transactionStrategy: TransactionStrategy;

  protected executeService(input: P['input']): Promise<ServiceResult<P>> {
    return this.transactionStrategy.executeDatabaseScope(this, input);
  }

  async execute(input: P['input']): Promise<ServiceResult<P>> {
    const result = await super.execute(input);
    if (result.isFailure()) {
      throw this.moduleResolver.getLogger().error(
        'recieved failure result for event service',
        { input, result },
      );
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected runInitialChecks(input: P['input']): Result<never, undefined> {
    // Для событий не выполняется проверка разрешений и валидации
    return success(undefined);
  }
}
