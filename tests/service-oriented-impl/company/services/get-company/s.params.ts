import { QueryServiceParams } from '../../../../../src/api/service/types';
import { UuidType } from '../../../../../src/core/types';
import { RequestDod } from '../../../../../src/domain/domain-data/domain-types';
import { CompanyAttrs, CompanyParams } from '../../domain-data/company/params';
import { CompanyDoesntExistByIdError } from '../../domain-object/company/repo-errors';

export type GetCompanyRequestDod = RequestDod<'getCompany', { id: UuidType }>;

export type GetCompanyOut = CompanyAttrs;

export type GetCompanyServiceParams = QueryServiceParams<
  'GettingCompanyService',
  CompanyParams,
  GetCompanyRequestDod,
  GetCompanyOut,
  CompanyDoesntExistByIdError
>
