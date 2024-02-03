import { ActionParams, DomainResult } from '../../../../../src/domain/domain-data/params-types';
import { ErrorDod, EventDod } from '../../../../../src/domain/domain-data/domain-types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../company/role-errors';
import { PersonAttrs } from './params';

export type AddingPersonDomainCommand = Omit<PersonAttrs, 'id' | 'contacts'>;

// В AddPersonActionParams ошибка не добавлена, потому что данная ошибка выясняется не
// на уровне домена, а в service в ходе обращения в репозиторий, поэтому добавлена
// в ответ на уровне service.
export type PersonAlreadyExistsError = ErrorDod<
  {text: 'Человек с данным ИИН уже существует в системе', hint: Record<never, unknown>},
  'PersonExistsError'
>;

type PersonAddedEventAttrs = PersonAttrs

export type PersonAddedEvent = EventDod<PersonAddedEventAttrs, 'PersonAddedEvent'>;

export type AddPersonActionParams = ActionParams<
  AddingPersonDomainCommand,
  undefined,
  AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonAddedEvent[]
>

export type AddPersonResult = DomainResult<AddPersonActionParams>;
