import { QueryServiceParams } from '../../../../../src/app/service/types';
import { UuidType } from '../../../../../src/common/types';
import { RequestDod } from '../../../../../src/domain/domain-data/domain-types';
import { CompanyAttrs, CompanyParams } from '../../domain-data/company/params';
import { CompanyDoesntExistByIdError } from '../../domain-object/company/repo-errors';

export type GetCompanyRequestDod = RequestDod<{ id: UuidType }, 'getCompany'>;

export type GetCompanyOut = CompanyAttrs;

export type GetCompanyServiceParams = QueryServiceParams<
  CompanyParams,
  GetCompanyRequestDod,
  GetCompanyOut,
  CompanyDoesntExistByIdError
>
