import { CommandUseCaseParams, GetUcResult, InputOptions } from '../../../../../src/app/use-case/types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../../domain-data/company/role-errors';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonAlreadyExistsError } from '../../domain-data/person/add-person.params';
import { PersonParams } from '../../domain-data/person/params';

export type AddPersonActionDod = {
  actionName: 'addPerson',
  body: AddingPersonDomainCommand
}

export type AddingPersonInputOptions = InputOptions<AddPersonActionDod>

export type AddingPersonUCParams = CommandUseCaseParams<
  PersonParams,
  AddingPersonInputOptions,
  string,
  PersonAlreadyExistsError | AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonAddedEvent[]
>;

export type AddingPersonResult = GetUcResult<AddingPersonUCParams>;
