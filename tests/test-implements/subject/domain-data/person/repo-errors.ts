import { ErrorDod } from '../../../../../src/domain/domain-object-data/domain-types';

export type PersonAlreadyExistsError = ErrorDod<
  {text: 'Человек с данным ИИН уже существует в системе', hint: Record<never, unknown>},
  'PersonExistsError'
>;
