import { success } from '../../../common/result/success';
import { Result } from '../../../common/result/types';
import { GeneralModuleResolver } from '../../module/types';
import { BaseService } from '../base.service';
import { TransactionStrategy } from '../transaction-strategy/strategy';
import { GeneralEventServiceParams, ServiceResult } from '../types';

export abstract class EventService<
  P extends GeneralEventServiceParams, RES extends GeneralModuleResolver
> extends BaseService<P, RES> {
  get moduleName(): string {
    return this.moduleResolver.getModuleName();
  }

  protected validator!: never;

  protected supportedCallers = ['DomainUser', 'AnonymousUser'] as const;

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

  protected checkValidations(input: P['input']): Result<never, undefined> {
    return success(undefined);
  }
}
