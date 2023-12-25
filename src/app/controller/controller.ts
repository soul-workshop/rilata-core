import { ActionDod } from '../../domain/domain-object-data/domain-types';
import { Caller } from '../caller';
import { Module } from '../module/module';
import { InternalError, UseCaseBaseErrors } from '../use-case/error-types';
import { InputOptions } from '../use-case/types';
import { dodUtility } from '../../common/utils/domain-object/dod-utility';
import { Locale } from '../../domain/locale';

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

  constructor(protected module: Module, protected runMode: string) {}

  protected async executeUseCase(
    actionDod: ActionDod,
    caller: Caller,
    response: ExpressResponse,
  ): Promise<void> {
    try {
      const actionName = actionDod.meta.name;
      const useCase = this.module.getUseCaseByName(actionName as string);
      const inputOptions: InputOptions<ActionDod> = {
        actionDod,
        caller,
      };

      const useCaseResult = await useCase.execute(inputOptions);

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
      this.module.getLogger().fatalError('server internal error', { actionDod, caller });
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
