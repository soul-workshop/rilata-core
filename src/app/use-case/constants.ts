import { Locale } from '../../domain/locale';
import { BadRequestError, InternalError, PermissionDeniedError } from './types';

export const badRequestError: BadRequestError<Locale> = {
  locale: {
    text: 'Bad request',
    hint: {},
  },
  name: 'BadRequest',
  errorType: 'app-error',
  domainType: 'error',
};

export const internalError: InternalError<Locale> = {
  locale: {
    text: 'Internal error',
    hint: {},
  },
  name: 'Internal error',
  errorType: 'app-error',
  domainType: 'error',
};

export const permissionDeniedError: PermissionDeniedError<Locale> = {
  locale: {
    text: 'Действие не доступно',
    hint: {},
  },
  name: 'Permission denied',
  errorType: 'domain-error',
  domainType: 'error',
};

export const authPermissionDeniedError: PermissionDeniedError<Locale> = {
  locale: {
    text: 'Действие доступно только для аутентифицированных пользователей.',
    hint: {},
  },
  name: 'Permission denied',
  errorType: 'domain-error',
  domainType: 'error',
};
