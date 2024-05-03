import { EventDod } from '../../../../../../src/domain/domain-data/domain-types';
import { ActionParams } from '../../../../../../src/domain/domain-data/params-types';
import { CompanyAR } from '../../../domain-object/company/a-root';
import { CompanyDoesntExistByIdError } from '../../../domain-object/company/repo-errors';
import { CompanyAttrs, CompanyCmdARDT } from '../params';

export type AddCompanyDomainCommand = Omit<CompanyAttrs, 'id'>

export type AddCompanyOut = CompanyAR

export type CompanyAddedEvent = EventDod<
  'CompanyAddedEvent',
  AddCompanyDomainCommand,
  CompanyCmdARDT
>

export type AddCompanyActionParams = ActionParams<
  AddCompanyDomainCommand,
  AddCompanyOut,
  CompanyDoesntExistByIdError,
  CompanyAddedEvent[]
>
