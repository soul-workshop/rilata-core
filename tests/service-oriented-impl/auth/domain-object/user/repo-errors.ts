import { UuidType } from '../../../../../src/common/types';
import { ErrorDod } from '../../../../../src/domain/domain-data/domain-types';

export type UserDoesNotExistByIdError = ErrorDod<'UserDoesNotExistByIdError', {
  name: 'UserDoesNotExistByIdError',
  text: 'Не найден пользователь с id {{id}}',
  hint: { id: UuidType }
}>
