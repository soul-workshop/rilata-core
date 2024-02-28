import { UserId, UuidType } from '../../../../../src/common/types';
import { ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-data/params-types';
import { RegisterCompanyActionParams } from './register-company/a-params';

export type CompanyAttrs = {
  id: UuidType,
  name: string,
  bin: string,
  employees: UserId[],
  admins: UserId[],
  address?: string,
}

export type CompanyMeta = DomainMeta<'CompanyAR'>

export type CompanyCmdARDT = ARDT<CompanyAttrs, CompanyMeta>

export type CompanyParams = AggregateRootDataParams<
  CompanyAttrs,
  CompanyMeta,
  RegisterCompanyActionParams,
  []
>
