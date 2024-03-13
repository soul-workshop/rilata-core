import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { EventBusMessageType } from '../bus/types';
import { MuttableService } from './muttable-service';
import { GeneralEventServiceParams, ServiceResult } from './types';

export abstract class EventService<PARAMS extends GeneralEventServiceParams>
  extends MuttableService<PARAMS> {
  abstract eventBusMessateType: EventBusMessageType;

  abstract publishModuleName: string;

  get handlerModuleName(): string {
    return this.moduleResolver.getModuleName();
  }

  protected validator!: never;

  protected supportedCallers = ['DomainUser', 'AnonymousUser'] as const;

  async execute(input: PARAMS['input']): Promise<ServiceResult<PARAMS>> {
    const result = await super.execute(input);
    if (result.isFailure()) {
      throw this.moduleResolver.getLogger().error(
        'recieved failure result for event service',
        { input, result },
      );
    }
    return result;
  }

  protected checkValidations(input: PARAMS['input']): Result<never, undefined> {
    return success(undefined);
  }
}
