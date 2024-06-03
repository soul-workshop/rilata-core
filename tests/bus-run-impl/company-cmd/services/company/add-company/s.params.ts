import { CommandServiceParams } from '../../../../../../src/api/service/types';
import { RequestDod } from '../../../../../../src/domain/domain-data/domain-types';
import { AddCompanyDomainCommand, CompanyAddedEvent } from '../../../domain-data/company/add-company/a-params';
import { CompanyParams } from '../../../domain-data/company/params';
import { CompanyAlreadyExistError } from '../../../domain-object/company/repo-errors';

export type AddCompanyRequestDodAttrs = AddCompanyDomainCommand;

export type AddCompanyRequestDod = RequestDod<'addCompany', AddCompanyRequestDodAttrs>

export type AddCompanyOut = { id: string }

export type AddCompanyServiceParams = CommandServiceParams<
  'AddingCompanyService',
  CompanyParams,
  AddCompanyRequestDod,
  AddCompanyOut,
  CompanyAlreadyExistError,
  Array<CompanyAddedEvent>
>
