import { UserId, UuidType } from '../../../../../src/common/types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-object-data/params-types';
import { DomainMeta } from '../../../../../src/domain/domain-object-data/domain-types';

export type CompanyAttrs = {
  id: UuidType
  name: UuidType,
  employeers: UserId[],
  admins: UserId[],
  staffManagers: UserId[],
}

export type CompanyMeta = DomainMeta<'CompanyAR'>;

export type CompanyParams = AggregateRootDataParams<
  CompanyAttrs, CompanyMeta, never, ['admins']
>;

export type OutputCompanyAttrs = CompanyAttrs;
