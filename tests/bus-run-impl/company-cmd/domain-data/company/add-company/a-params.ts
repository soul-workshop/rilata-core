import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { CompanyAR } from '../../../domain-object/company/a-root';
import { CompanyAttrs, CompanyCmdARDT } from '../params';

export type AddCompanyDomainCommand = Omit<CompanyAttrs, 'id'>

export type AddCompanyOut = CompanyAR

export type CompanyAddedEvent = EventDod<
  'CompanyAddedEvent',
  'AddingCompanyService',
  'CompanyCmdModule',
  AddCompanyDomainCommand,
  CompanyCmdARDT
>
