import { ActionDod } from '../../domain/domain-object-data/common-types';
import { Caller } from '../caller';
import { Module } from '../module/module';
import { ModuleType } from '../module/types';
import { ResultDTO } from '../result-dto';
import { UseCaseBaseErrors } from '../use-case/error-types';
import { InputOptions } from '../use-case/types';

type ExpressResponse = {
  status(status: number): ExpressResponse,
  send(payload: unknown): ExpressResponse,
}

export abstract class Controller {
  STATUS_CODES: Record<UseCaseBaseErrors['name'], number> = {
    'Not Found': 404,
    'Permission denied': 403,
    'Internal error': 500,
    'Bad Request': 400,
    'Validation Error': 400,
  };

  protected async executeUseCase(
    actionDod: ActionDod,
    caller: Caller,
    module: Module<ModuleType>,
    response: ExpressResponse,
  ): Promise<void> {
    const { actionName } = actionDod;
    const useCase = module.getUseCaseByName(actionName as string);
    const inputOptions: InputOptions<ActionDod> = {
      actionDod,
      caller,
    };

    const useCaseResult = await useCase.execute(inputOptions);

    if (useCaseResult.isSuccess() === true) {
      response.status(200);
    } else if (useCaseResult.isFailure()) {
      const err = useCaseResult.value as UseCaseBaseErrors;
      response.status(this.STATUS_CODES[err.name]);
    }

    const resultDTO: ResultDTO<unknown, unknown> = {
      success: useCaseResult.isSuccess(),
      payload: useCaseResult.value,
    };

    response.send(resultDTO);
  }
}
