import { Caller } from '../../../../../src/app/caller';
import { CommandUseCaseParams, GetUcResult } from '../../../../../src/app/use-case/types';
import { UseCaseCommandDod } from '../../../../../src/domain/domain-object-data/common-types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../../domain-data/company/role-errors';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonAlreadyExistsError } from '../../domain-data/person/add-person.params';

export type AddingPersonUCCommand = UseCaseCommandDod<AddingPersonDomainCommand, 'AddPersonCommand'>;

export type AddingPersonInputOptions = {
  command: AddingPersonUCCommand,
  caller: Caller,
}

export type AddingPersonUCParams = CommandUseCaseParams<
  AddingPersonInputOptions,
  string,
  PersonAlreadyExistsError | AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonAddedEvent[]
>;

export type AddingPersonResult = GetUcResult<AddingPersonUCParams>;
