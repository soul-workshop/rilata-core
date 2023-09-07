import { UseCaseOptions } from '../../../../../../src/app/use-case-types';
import { CommandUseCaseParams } from '../../../../../../src/app/use-case/types';
import { Result } from '../../../../../../src/common/result/types';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonExistsError } from '../../domain-data/person-params';

export type AddingPersonUCParams = CommandUseCaseParams<
  AddingPersonDomainCommand,
  string, // id,
  PersonExistsError,
  PersonAddedEvent
>;

export type AddingPersonOptions = UseCaseOptions

export type AddingPersonResult = Result<PersonExistsError, string>;
