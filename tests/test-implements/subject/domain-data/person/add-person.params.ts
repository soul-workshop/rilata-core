import { ActionParams, DomainResult } from '../../../../../src/domain/domain-object-data/aggregate-data-types';
import { ErrorDod, EventDod } from '../../../../../src/domain/domain-object-data/common-types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../company/role-errors';
import { PersonAttrs } from './params';

export type AddingPersonDomainCommand = Omit<PersonAttrs, 'id' | 'contacts'>;

// В AddPersonActionParams ошибка не добавлена, потому что данная ошибка выясняется не
// на уровне домена, а в useCase в ходе обращения в репозиторий, поэтому добавлена
// в ответ на уровне useCase.
export type PersonAlreadyExistsError = ErrorDod<
  {text: 'Человек с данным ИИН уже существует в системе', hint: Record<never, unknown>},
  'PersonExistsError'
>;

type PersonAddedEventAttrs = {
  aRoot: PersonAttrs
}
export type PersonAddedEvent = EventDod<PersonAddedEventAttrs, 'PersonAddedEvent'>;

export type AddPersonActionParams = ActionParams<
  'addPerson',
  'class',
  AddingPersonDomainCommand,
  undefined,
  AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonAddedEvent[]
>

export type AddPersonResult = DomainResult<AddPersonActionParams>;
