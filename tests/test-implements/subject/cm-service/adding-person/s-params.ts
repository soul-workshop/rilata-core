import { CommandServiceParams, ServiceResult } from '../../../../../src/app/service/types';
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

export type AddingPersonServiceParams = CommandServiceParams<
  PersonParams,
  AddPersonActionDod,
  string,
  PersonAlreadyExistsError | AllowedOnlyEmployeerError | AllowedOnlyStaffManagersError,
  PersonAddedEvent[]
>;

export type AddingPersonResult = ServiceResult<AddingPersonServiceParams>;
