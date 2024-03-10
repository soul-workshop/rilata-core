import { UuidType } from '../../../../../src/common/types';
import { ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-data/params-types';
import { AddCompanyActionParams } from './add-company/a-params';

export type CompanyAttrs = {
  id: UuidType,
  name: string,
  bin: string,
  address?: string,
}

export type CompanyMeta = DomainMeta<'CompanyAR', 'id'>

export type CompanyCmdARDT = ARDT<CompanyAttrs, CompanyMeta>

export type CompanyParams = AggregateRootDataParams<
  CompanyAttrs,
  CompanyMeta,
  AddCompanyActionParams,
  []
>
