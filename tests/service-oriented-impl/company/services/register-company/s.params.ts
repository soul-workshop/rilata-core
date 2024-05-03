import { CommandServiceParams } from '../../../../../src/app/service/types';
import { RequestDod } from '../../../../../src/domain/domain-data/domain-types';
import { PersonAttrs } from '../../../subject/domain-data/person/params';
import { PersonAlreadyExistsError, PersonDoesntExistByIinError } from '../../../subject/domain-object/person/repo-errors';
import { CompanyParams } from '../../domain-data/company/params';
import { CompanyRegisteredEvent, RegisterCompanyDomainCommand } from '../../domain-data/company/register-company/a-params';
import { CompanyAlreadyExistError } from '../../domain-object/company/repo-errors';

export type ExistPerson = {
  type: 'existPerson',
} & Pick<PersonAttrs, 'iin'>

export type NewPerson = {
  type: 'newPerson',
} & Pick<PersonAttrs, 'iin' | 'firstName' | 'lastName'>

export type RegisterCompanyRequestDodAttrs = {
  person: NewPerson | ExistPerson,
  company: Omit<RegisterCompanyDomainCommand, 'employees' | 'admins'>,
}

export type RegisterCompanyRequestDod = RequestDod<'registerCompany', RegisterCompanyRequestDodAttrs>

export type RegisterCompanyOut = { id: string }

export type CompanyRegisteredServiceParams = CommandServiceParams<
  CompanyParams,
  RegisterCompanyRequestDod,
  RegisterCompanyOut,
  CompanyAlreadyExistError | PersonAlreadyExistsError | PersonDoesntExistByIinError,
  Array<CompanyRegisteredEvent>
>
