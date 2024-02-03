import { ErrorDod } from '../../../../../src/domain/domain-data/domain-types';

export type PersonAlreadyExistsError = ErrorDod<
  {text: 'Человек с данным ИИН уже существует в системе', hint: Record<never, unknown>},
  'PersonExistsError'
>;
