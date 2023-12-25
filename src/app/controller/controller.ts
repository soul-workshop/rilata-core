import { ActionDod } from '../../domain/domain-data/domain-types';
import { Caller } from '../caller';
import { InternalError, UseCaseBaseErrors } from '../use-case/error-types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';
import { storeDispatcher } from '../async-store/store-dispatcher';
import { ModuleResolver } from '../resolves/module-resolver';
import { StorePayload } from '../async-store/types';

type ExpressResponse = {
  status(status: number): ExpressResponse,
  send(payload: unknown): ExpressResponse,
}

export abstract class Controller {
  STATUS_CODES: Record<UseCaseBaseErrors['meta']['name'], number> = {
    'Not found': 404,
    'Permission denied': 403,
    'Internal error': 500,
    'Bad request': 400,
    'Validation error': 400,
  };

  constructor(protected moduleResolver: ModuleResolver, protected runMode: string) {}

  protected async executeUseCase(
    actionDod: ActionDod,
    caller: Caller,
    response: ExpressResponse,
  ): Promise<void> {
    try {
      const actionName = actionDod.meta.name;
      const useCase = this.moduleResolver.getModule().getUseCaseByName(actionName);

      const store: StorePayload = {
        caller,
        moduleResolver: this.moduleResolver,
        actionId: actionDod.meta.actionId,
      };
      const threadStore = storeDispatcher.getThreadStore();
      const useCaseResult = await threadStore.run(
        store,
        (aDod) => useCase.execute(aDod),
        actionDod,
      );

      if (useCaseResult.isSuccess() === true) {
        response.status(200);
      } else if (useCaseResult.isFailure()) {
        const err = useCaseResult.value as UseCaseBaseErrors;
        response.status(this.STATUS_CODES[err.meta.name]);
      }

      response.send({
        success: useCaseResult.isSuccess(),
        payload: useCaseResult.value,
      });
    } catch (e) {
      if (this.runMode.includes('test')) {
        throw e;
      }
      this.moduleResolver.getLogger().fatalError('server internal error', { actionDod, caller });
      const err = dodUtility.getAppErrorByType<InternalError<Locale>>(
        'Internal error',
        'Извините, на сервере произошла ошибка',
        {},
      );

      response.send({
        success: false,
        payload: err,
      });
    }
  }
}
