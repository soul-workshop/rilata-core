import { EventServiceParams } from '../../../../../src/api/service/types';
import { EventDod } from '../../../../../src/domain/domain-data/domain-types';
import { AddCompanyDomainCommand, CompanyAddedEvent } from '../../../company-cmd/domain-data/company/add-company/a-params';
import { CompanyCmdARDT, CompanyParams } from '../../../company-cmd/domain-data/company/params';

export type CompanyAddedReadEvent = EventDod<
  'CompanyAddedEvent',
  'CompanyAddedService',
  'CompanyReadModule',
  AddCompanyDomainCommand,
  CompanyCmdARDT
>

export type CompanyAddedServiceParams = EventServiceParams<
  'CompanyAddedService',
  CompanyParams,
  CompanyAddedEvent,
  CompanyAddedReadEvent[]
>
