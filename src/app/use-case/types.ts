import { Result } from '../../common/result/types';
import {
  ErrorDod, GeneralCommandDod, GeneralErrorDod, GeneralEventDod,
} from '../../domain/domain-object-data/types';
import { DTO } from '../../domain/dto';
import { Locale } from '../../domain/locale';
import { Caller, CallerType } from '../caller';
import { DtoFieldErrors } from '../../domain/validator/field-validator/types';

export type ValidationError = {
  errors: DtoFieldErrors,
  name: 'validation-error',
  domainType: 'error',
  errorType: 'app-error',
}

export type PermissionDeniedError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'permission-denied', 'domain-error'>;

export type InternalError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'internal-error', 'app-error'>;

export type UseCaseBaseErrors =
  PermissionDeniedError<Locale> | InternalError<Locale> | ValidationError;

export type UseCaseParams<
  IN, // что входит в useCase,
  SUCCESS_OUT, // ответ клиенту в случае успеха
  ERRORS extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENT, // публикуемые доменные события
> = {
  in: IN,
  successOut: SUCCESS_OUT,
  errors: ERRORS,
  event?: EVENT,
}

export type GeneralUcParams = UseCaseParams<
  unknown, unknown, GeneralErrorDod, GeneralEventDod
>;

export type CommandUseCaseParams<
  IN extends GeneralCommandDod, // что входит в useCase,
  SUCCESS_OUT, // ответ в случае успеха
  CALLER extends CallerType[],
  ERRORS extends GeneralErrorDod, // доменные ошибки при выполнении запроса
  EVENT extends GeneralEventDod, // публикуемые доменные события
> = {
  in: IN,
  successOut: SUCCESS_OUT,
  caller: CALLER,
  errors: ERRORS,
  event: EVENT,
}

export type GeneralCommandUcParams = CommandUseCaseParams<
  GeneralCommandDod, unknown, CallerType[], GeneralErrorDod, GeneralEventDod
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
  in: P['in'],
  caller: Caller,
}
