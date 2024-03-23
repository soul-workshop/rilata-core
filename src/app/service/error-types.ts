import { ErrorDod } from '../../domain/domain-data/domain-types';
import { Locale } from '../../domain/locale';
import { ArrayFieldErrors, FieldErrors } from '../../domain/validator/field-validator/types';
import { JwtDecodeErrors, JwtVerifyErrors } from '../jwt/jwt-errors';

export type ValidationError = {
  errors: FieldErrors | ArrayFieldErrors,
  name: 'Validation error',
  meta: {
    domainType: 'error',
    errorType: 'app-error',
  }
}

export type BadRequestError<L extends Locale<'Bad request'>> = ErrorDod<'Bad request', L, 'app-error'>;

export type NotFoundError<L extends Locale<'Not found'>> = ErrorDod<'Not found', L, 'app-error'>;

export type NetError<L extends Locale<'Net error'>> = ErrorDod<'Net error', L, 'app-error'>;

export type PermissionDeniedError<LOCALE extends Locale<'Permission denied'>> =
  ErrorDod<'Permission denied', LOCALE, 'domain-error'>;

export type InternalError<LOCALE extends Locale<'Internal error'>> =
  ErrorDod<'Internal error', LOCALE, 'app-error'>;

export type ServiceBaseErrors =
  BadRequestError<Locale<'Bad request'>>
  | NotFoundError<Locale<'Not found'>>
  | NetError<Locale<'Net error'>>
  | PermissionDeniedError<Locale<'Permission denied'>>
  | InternalError<Locale<'Internal error'>>
  | ValidationError
  | JwtDecodeErrors
  | JwtVerifyErrors;

export type BackendBaseErrors = ServiceBaseErrors;
