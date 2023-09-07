import { ErrorDod } from '../../domain/domain-object-data/common-types';
import { Locale } from '../../domain/locale';
import { DtoFieldErrors } from '../../domain/validator/field-validator/types';

export type ValidationError = {
  errors: DtoFieldErrors,
  name: 'validation-error',
  domainType: 'error',
  errorType: 'app-error',
}

export type BadRequestError<L extends Locale> = ErrorDod<L, 'BadRequest', 'app-error'>;

export type NotFoundError<L extends Locale> = ErrorDod<L, 'NotFound', 'app-error'>;

export type PermissionDeniedError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'Permission denied', 'domain-error'>;

export type InternalError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'Internal error', 'app-error'>;

export type UseCaseBaseErrors =
  BadRequestError<Locale>
  | PermissionDeniedError<Locale>
  | InternalError<Locale>
  | ValidationError;
