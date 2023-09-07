/* eslint-disable no-use-before-define */
import { Result } from '../../common/result/types';
import {
  ErrorDod, GeneralCommandDod, GeneralErrorDod, GeneralEventDod,
} from '../../domain/domain-object-data/common-types';
import { DTO } from '../../domain/dto';
import { Locale } from '../../domain/locale';
import { Caller } from '../caller';
import { DtoFieldErrors } from '../../domain/validator/field-validator/types';
import { UseCase } from './use-case';
import { GeneralARDParams } from '../../domain/domain-object-data/aggregate-data-types';

export type GeneralUseCase = UseCase<GeneralARDParams, GeneralUcParams>;

export type ValidationError = {
  errors: DtoFieldErrors,
  name: 'validation-error',
  domainType: 'error',
  errorType: 'app-error',
}

export type CommandNameNotValidError = ErrorDod<Locale, 'CommandNameNotValidError', 'app-error'>;

export type PermissionDeniedError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'permission-denied', 'domain-error'>;

export type InternalError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'internal-error', 'app-error'>;

export type UseCaseBaseErrors =
  CommandNameNotValidError
  | PermissionDeniedError<Locale>
  | InternalError<Locale>
  | ValidationError;

export type UseCaseParams<
  INPUT, // что входит в useCase,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  FAIL_OUT, // возвращаемый ответ в случау не успеха
  EVENTS extends unknown[] = [], // публикуемые доменные события
> = {
  input: INPUT,
  successOut: SUCCESS_OUT,
  errors: FAIL_OUT,
  events?: EVENTS,
}

export type GeneralUcParams = UseCaseParams<
  unknown, unknown, unknown, unknown[]
>;

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

export type GetDTO<IN> = IN extends DTO ? IN : never;

export type UcResult = Result<GeneralErrorDod, unknown>;

export type GetUcResult<P extends GeneralUcParams> = Result<
  P['errors'] | UseCaseBaseErrors,
  P['successOut']
>

export type GetUcErrorsResult<P extends GeneralUcParams> =
  Result<P['errors'] | UseCaseBaseErrors, never>

export type GetUcOptions<P extends GeneralUcParams> = {
  in: P['input'],
  caller: Caller,
}
