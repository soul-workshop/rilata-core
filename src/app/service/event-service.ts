import { success } from '../../common/result/success';
import { Result } from '../../common/result/types';
import { MuttableService } from './muttable-service';
import { GeneralEventServiceParams } from './types';

export abstract class EventService<PARAMS extends GeneralEventServiceParams>
  extends MuttableService<PARAMS> {
  protected validator!: never;

  protected supportedCallers = ['ModuleCaller'] as const;

  protected checkValidations(input: PARAMS['input']): Result<never, undefined> {
    return success(undefined);
  }
}
