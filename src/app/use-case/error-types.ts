import { ErrorDod } from '../../domain/domain-object-data/common-types';
import { Locale } from '../../domain/locale';
import { ArrayFieldErrors, FieldErrors } from '../../domain/validator/field-validator/types';

export type ValidationError = {
  errors: FieldErrors | ArrayFieldErrors,
  name: 'Validation Error',
  domainType: 'error',
  errorType: 'app-error',
}

export type BadRequestError<L extends Locale> = ErrorDod<L, 'Bad Request', 'app-error'>;

export type NotFoundError<L extends Locale> = ErrorDod<L, 'Not Found', 'app-error'>;

export type PermissionDeniedError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'Permission denied', 'domain-error'>;

export type InternalError<LOCALE extends Locale> =
  ErrorDod<LOCALE, 'Internal error', 'app-error'>;

export type UseCaseBaseErrors =
  BadRequestError<Locale>
  | NotFoundError<Locale>
  | PermissionDeniedError<Locale>
  | InternalError<Locale>
  | ValidationError;
