/* eslint-disable no-use-before-define */
import { Result } from '../../common/result/types';
import { GetArrayType } from '../../common/type-functions';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';
import {
  GeneralErrorDod, GeneralEventDod, ActionDod,
} from '../../domain/domain-object-data/common-types';
import { DtoFieldValidator } from '../../domain/validator/field-validator/dto-field-validator';
import { Caller } from '../caller';
import { ModuleType } from '../module/types';
import { CommandUseCase } from './command-use-case';
import { UseCaseBaseErrors } from './error-types';
import { QueryUseCase } from './query-use-case';

export type AppEventType = 'command-event' | 'read-module' | 'event';

export type GetAppEventDod<EVENTS extends GeneralEventDod[], M_TYPE extends ModuleType> =
  M_TYPE extends 'command-module'
    ? Array<GetArrayType<EVENTS> & { event: 'command-event' }>
    : M_TYPE extends 'read-module'
      ? Array<GetArrayType<EVENTS> & { event: 'read-event' }>
      : EVENTS

export type InputOptions<A extends ActionDod> = {
  actionDod: A,
  caller: Caller,
}

export type GeneralInputOptions = InputOptions<ActionDod>;

export type QueryUseCaseParams<
  AR_PARAMS extends GeneralARDParams,
  INPUT_OPT extends GeneralInputOptions, // что входит в useCase,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT extends GeneralErrorDod, // возвращаемый ответ в случае не успеха
> = {
  aRootName: AR_PARAMS['meta']['name'],
  inputOptions: INPUT_OPT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
}

export type GeneralQueryUcParams = QueryUseCaseParams<
  GeneralARDParams, GeneralInputOptions, unknown, GeneralErrorDod
>;

export type GeneraQuerylUseCase = QueryUseCase<GeneralQueryUcParams>;

export type CommandUseCaseParams<
  AR_PARAMS extends GeneralARDParams,
  INPUT_OPT extends GeneralInputOptions, // что входит в useCase,
  SUCCESS_OUT, // ответ в случае успеха
  FAIL_OUT extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = {
  aRootName: AR_PARAMS['meta']['name'],
  inputOptions: INPUT_OPT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events: EVENTS,
}

export type GeneralCommandUcParams = CommandUseCaseParams<
  // eslint-disable-next-line max-len
  GeneralARDParams, GeneralInputOptions, unknown, GeneralErrorDod, GeneralEventDod[]
>;

export type GeneralCommandUseCase = CommandUseCase<GeneralCommandUcParams>;

export type ActionDodValidator<UC_PARAMS extends GeneralQueryUcParams | GeneralCommandUcParams> =
  DtoFieldValidator<
    GetActionDodName<UC_PARAMS>,
    true, false,
    GetActionDodBody<UC_PARAMS>
  >

export type UcResult<P extends GeneralQueryUcParams | GeneralCommandUcParams> = Result<
  P['errors'] | UseCaseBaseErrors,
  P['successOut']
>

export type GetUcErrorsResult<P extends GeneralQueryUcParams | GeneralCommandUcParams> =
  Result<P['errors'] | UseCaseBaseErrors, never>

export type GetUcOptions<P extends GeneralQueryUcParams> = P['inputOptions'];

export type GetActionDodName<UC_PARAMS extends GeneralQueryUcParams | GeneralCommandUcParams> =
  UC_PARAMS['inputOptions']['actionDod']['actionName']

export type GetActionDodBody<UC_PARAMS extends GeneralQueryUcParams | GeneralCommandUcParams> =
  UC_PARAMS['inputOptions']['actionDod']['body']
