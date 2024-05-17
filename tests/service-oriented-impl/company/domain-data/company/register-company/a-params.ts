import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { CompanyAR } from '../../../domain-object/company/a-root';
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
