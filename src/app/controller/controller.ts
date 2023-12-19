import { Result } from '../../common/result/types';
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
  async execute(
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

    const useCaseResult: Result<UseCaseBaseErrors, unknown> = await useCase.execute(inputOptions);

    if (useCaseResult.isSuccess() === true) {
      response.status(200);
    } else if (useCaseResult.isFailure()) {
      if (useCaseResult.value.name === 'Internal error') response.status(500);
      else if (useCaseResult.value.name === 'Permission denied') response.status(403);
      else if (useCaseResult.value.name === 'validation-error') response.status(400);
      else if (useCaseResult.value.name === 'BadRequest') response.status(400);
    }

    const resultDTO: ResultDTO<unknown, unknown> = {
      success: useCaseResult.isSuccess(),
      payload: useCaseResult.value,
    };

    response.send(resultDTO);
  }
}
