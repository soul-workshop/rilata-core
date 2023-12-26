import { UuidType } from '../../../../../src/common/types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-data/params-types';
import { DomainMeta } from '../../../../../src/domain/domain-data/domain-types';

export type EmployeerAttrs = {
  id: UuidType
  personId: UuidType,
}

export type EmployeerMeta = DomainMeta<'EmployeerAR'>;

export type EmployeerParams = AggregateRootDataParams<
  EmployeerAttrs, EmployeerMeta, never, never
>;

export type OutputEmployeerAttrs = EmployeerAttrs;
