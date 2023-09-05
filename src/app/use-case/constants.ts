import { Locale } from '../../domain/locale';
import { PermissionDeniedError } from './types';

export const permissionDeniedError: PermissionDeniedError<Locale> = {
  attrs: {
    text: 'Действие не доступно',
    hint: {},
  },
  name: 'permission-denied',
  errorType: 'domain-error',
  domainType: 'error',
};

export const authPermissionDeniedError: PermissionDeniedError<Locale> = {
  attrs: {
    text: 'Действие доступно только для аутентифицированных пользователей.',
    hint: {},
  },
  name: 'permission-denied',
  errorType: 'domain-error',
  domainType: 'error',
};
