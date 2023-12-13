import { Result } from '../../common/result/types';
import { GetArrayType } from '../../common/type-functions';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';
import {
  GeneralCommandDod, GeneralErrorDod, GeneralEventDod,
} from '../../domain/domain-object-data/common-types';
import { Caller } from '../caller';
import { ModuleType } from '../module/types';
import { CommandUseCase } from './command-use-case';
import { UseCaseBaseErrors } from './error-types';
import { QueryUseCase } from './query-use-case';

export type AppEventType = 'command-event' | 'read-event' | 'event';

export type GetAppEventDod<EVENTS extends GeneralEventDod[], M_TYPE extends ModuleType> =
  M_TYPE extends 'command-module'
    ? Array<GetArrayType<EVENTS> & { event: 'command-event' }>
    : M_TYPE extends 'read-module'
      ? Array<GetArrayType<EVENTS> & { event: 'read-event' }>
      : EVENTS

export type QueryUseCaseParams<
  AR_PARAMS extends GeneralARDParams,
  INPUT_OPT, // что входит в useCase,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT, // возвращаемый ответ в случау не успеха
> = {
  inputOptions: INPUT_OPT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
}

export type GeneralQueryUcParams = QueryUseCaseParams<GeneralARDParams, unknown, unknown, unknown>;

export type GeneraQuerylUseCase = QueryUseCase<GeneralQueryUcParams>;

export type CommandUCOptions = {
  command: GeneralCommandDod,
  caller: Caller,
}

export type CommandUseCaseParams<
  AR_PARAMS extends GeneralARDParams,
  INPUT_OPT extends CommandUCOptions, // что входит в useCase,
  SUCCESS_OUT, // ответ в случае успеха
  FAIL_OUT extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = {
  inputOptions: INPUT_OPT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events: EVENTS,
}

export type GeneralCommandUcParams = CommandUseCaseParams<
  GeneralARDParams, CommandUCOptions, unknown, GeneralErrorDod, GeneralEventDod[]
>;

export type GeneralCommandUseCase = CommandUseCase<GeneralCommandUcParams>;

export type GetUcResult<P extends GeneralQueryUcParams | GeneralCommandUcParams> = Result<
  P['errors'] | UseCaseBaseErrors,
  P['successOut']
>

export type GetUcErrorsResult<P extends GeneralQueryUcParams> =
  Result<P['errors'] | UseCaseBaseErrors, never>

export type GetUcOptions<P extends GeneralQueryUcParams> = P['inputOptions'];

export type GetUcParamsARParams<UCPARAMS extends GeneralQueryUcParams | GeneralCommandUcParams> =
  UCPARAMS extends QueryUseCaseParams<infer AR_PARAMS, unknown, unknown, unknown>
    ? AR_PARAMS
    : UCPARAMS extends CommandUseCaseParams<
      infer AR_PARAMS, CommandUCOptions, unknown, GeneralErrorDod, GeneralEventDod[]
    >
      ? AR_PARAMS
      : never
