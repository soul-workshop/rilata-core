import { Caller } from '../../../../../src/app/caller';
import { CommandUseCaseParams, GetUcResult } from '../../../../../src/app/use-case/types';
import { UseCaseCommandDod } from '../../../../../src/domain/domain-object-data/common-types';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonAlreadyExistsError } from '../../domain-data/person/add-person.a-params';

export type AddingPersonUCCommand = UseCaseCommandDod<AddingPersonDomainCommand, 'AddPersonCommand'>;

export type AddingPersonInputOptions = {
  in: AddingPersonUCCommand,
  caller: Caller,
}

export type AddingPersonUCParams = CommandUseCaseParams<
  'command-module',
  AddingPersonInputOptions,
  string,
  PersonAlreadyExistsError,
  PersonAddedEvent[]
>;

export type AddingPersonResult = GetUcResult<AddingPersonUCParams>;
