import { CommandUseCaseParams, UcResult } from '../../../../../src/app/use-case/types';
import { UuidType } from '../../../../../src/common/types';
import { AllowedOnlyEmployeerError, AllowedOnlyStaffManagersError } from '../../domain-data/company/role-errors';
import { AddingPersonDomainCommand, PersonAddedEvent, PersonAlreadyExistsError } from '../../domain-data/person/add-person.params';
import { PersonParams } from '../../domain-data/person/params';

export type AddPersonActionDod = {
  meta: {
    name: 'addPerson',
    actionId: UuidType,
    domainType: 'action',
  }
  body: AddingPersonDomainCommand
}

export type AddingPersonUCParams = CommandUseCaseParams<
  PersonParams,
  AddPersonActionDod,
  string,
  PersonAlreadyExistsError | AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonAddedEvent[]
>;

export type AddingPersonResult = UcResult<AddingPersonUCParams>;
