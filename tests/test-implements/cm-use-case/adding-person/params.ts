import { Caller } from '../../../../src/app/caller';
import { CommandUseCaseParams, UseCaseOptions } from '../../../../src/app/use-case/types';
import { Result } from '../../../../src/common/result/types';
import { UseCaseCommandDod } from '../../../../src/domain/domain-object-data/common-types';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonDoesNotExistsError } from '../../domain-data/person/params';

export type AddingPersonUCCommand = UseCaseCommandDod<AddingPersonDomainCommand, 'AddPersonCommand'>;

export type AddingPersonInputOptions = {
  in: AddingPersonUCCommand,
  caller: Caller,
}

export type AddingPersonUCParams = CommandUseCaseParams<
  AddingPersonInputOptions,
  string,
  PersonDoesNotExistsError,
  PersonAddedEvent[]
>;

export type AddingPersonOptions = UseCaseOptions

export type AddingPersonResult = Result<PersonDoesNotExistsError, string>;
