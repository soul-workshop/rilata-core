import { UuidType } from '../../../../../src/common/types';
import { AggregateRootParams, ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';
import { CompanyAddedEvent } from './add-company/a-params';

export type CompanyAttrs = {
  id: UuidType,
  name: string,
  bin: string,
  address?: string,
}

export type CompanyMeta = DomainMeta<'CompanyAR', 'id'>

export type CompanyParams = AggregateRootParams<
  CompanyAttrs,
  CompanyMeta,
  CompanyAddedEvent,
  []
>

export type CompanyCmdARDT = ARDT<CompanyAttrs, CompanyMeta, []>
