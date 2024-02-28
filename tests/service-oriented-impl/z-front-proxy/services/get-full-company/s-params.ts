import { QueryServiceParams } from '../../../../../src/app/service/types';
import { RequestDod } from '../../../../../src/domain/domain-data/domain-types';
import { CompanyDoesntExistByIdError } from '../../../company/domain-object/company/repo-errors';
import { FullCompany, FullCompanyParams } from '../../domain-data/full-company/params';

export type GetFullCompanyRequestDodAttrs = {
  id: string,
}

export type GetFullCompanyRequestDod = RequestDod<GetFullCompanyRequestDodAttrs, 'GetFullCompanyRequestDod'>

export type GetFullCompanyOut = FullCompany

export type GetFullCompanyErrors = CompanyDoesntExistByIdError

export type GetFullCompanyServiceParams = QueryServiceParams<
  FullCompanyParams,
  GetFullCompanyRequestDod,
  GetFullCompanyOut,
  GetFullCompanyErrors
>
