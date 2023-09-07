import { Result } from '../../common/result/types';
import {
  GeneralCommandDod, GeneralErrorDod, GeneralEventDod,
} from '../../domain/domain-object-data/common-types';
import { Caller } from '../caller';
import { UseCaseBaseErrors } from './error-types';
import { QueryUseCase } from './query-use-case';

export type QueryUseCaseParams<
  INPUT, // что входит в useCase,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT, // возвращаемый ответ в случау не успеха
> = {
  input: INPUT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
}

export type GeneralQueryUcParams = QueryUseCaseParams<unknown, unknown, unknown>;

export type GeneraQuerylUseCase = QueryUseCase<GeneralQueryUcParams>;

export type UseCaseOptions = {
  in: GeneralCommandDod,
  caller: Caller,
}

export type CommandUseCaseParams<
  INPUT extends UseCaseOptions, // что входит в useCase,
  SUCCESS_OUT, // ответ в случае успеха
  FAIL_OUT extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENTS extends GeneralEventDod[], // публикуемые доменные события
> = {
  input: INPUT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events: EVENTS,
}

export type GeneralCommandUcParams = CommandUseCaseParams<
  UseCaseOptions, unknown, GeneralErrorDod, GeneralEventDod[]
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
