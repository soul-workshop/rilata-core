import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { ActionParams } from '../../../../../../src/domain/domain-data/params-types';
import { CompanyAR } from '../../../domain-object/company/a-root';
import { CompanyDoesntExistByIdError } from '../../../domain-object/company/repo-errors';
import { CompanyAttrs, CompanyCmdARDT } from '../params';

export type RegisterCompanyDomainCommand = Omit<CompanyAttrs, 'id'>

export type RegisterCompanyOut = CompanyAR

export type CompanyRegisteredEvent = EventDod<
  'CompanyRegisteredEvent',
  'RegisteringCompanyService',
  'CompanyModule',
  RegisterCompanyDomainCommand,
  CompanyCmdARDT
>

export type RegisterCompanyActionParams = ActionParams<
  RegisterCompanyDomainCommand,
  RegisterCompanyOut,
  CompanyDoesntExistByIdError,
  CompanyRegisteredEvent[]
>
