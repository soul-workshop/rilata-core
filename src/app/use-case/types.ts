import { Result } from '../../common/result/types';
import { GetArrayType } from '../../common/type-functions';
import {
  GeneralCommandDod, GeneralErrorDod, GeneralEventDod,
} from '../../domain/domain-object-data/common-types';
import { Caller } from '../caller';
import { UseCaseBaseErrors } from './error-types';
import { QueryUseCase } from './query-use-case';

export type ModuleType = 'command-module' | 'read-module' | 'module';

export type AppEventType = 'command-event' | 'read-module' | 'event';

export type GetAppEventDod<EVENTS extends GeneralEventDod[], M_TYPE extends ModuleType> =
  M_TYPE extends 'command-module'
    ? Array<GetArrayType<EVENTS> & { event: 'command-event' }>
    : M_TYPE extends 'read-module'
      ? Array<GetArrayType<EVENTS> & { event: 'read-event' }>
      : EVENTS

export type QueryUseCaseParams<
  MODULE_TYPE extends ModuleType, // тип модуля к которому относится данный UC
  INPUT, // что входит в useCase,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT, // возвращаемый ответ в случау не успеха
> = {
  moduleType: MODULE_TYPE
  input: INPUT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
}

export type GeneralQueryUcParams = QueryUseCaseParams<ModuleType, unknown, unknown, unknown>;

export type GeneraQuerylUseCase = QueryUseCase<GeneralQueryUcParams>;

export type CommandUCOptions = {
  in: GeneralCommandDod,
  caller: Caller,
}

export type CommandUseCaseParams<
  MODULE_TYPE extends ModuleType, // тип модуля к которому относится данный UC
  INPUT extends CommandUCOptions, // что входит в useCase,
  SUCCESS_OUT, // ответ в случае успеха
  FAIL_OUT extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = {
  moduleType: MODULE_TYPE
  input: INPUT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events: EVENTS,
}

export type GeneralCommandUcParams = CommandUseCaseParams<
  ModuleType, CommandUCOptions, unknown, GeneralErrorDod, GeneralEventDod[]
>;

export type GetUcResult<P extends GeneralQueryUcParams | GeneralCommandUcParams> = Result<
  P['errors'] | UseCaseBaseErrors,
  P['successOut']
>

export type GetUcErrorsResult<P extends GeneralQueryUcParams> =
  Result<P['errors'] | UseCaseBaseErrors, never>

export type GetUcOptions<P extends GeneralQueryUcParams> = {
  in: P['input'],
  caller: Caller,
}
