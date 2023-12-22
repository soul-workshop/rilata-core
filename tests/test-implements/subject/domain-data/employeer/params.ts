import { UuidType } from '../../../../../src/common/types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-object-data/aggregate-data-types';
import { DomainMeta } from '../../../../../src/domain/domain-object-data/common-types';

export type EmployeerAttrs = {
  id: UuidType
  personId: UuidType,
}

export type EmployeerMeta = DomainMeta<'EmployeerAR'>;

export type EmployeerParams = AggregateRootDataParams<
  EmployeerAttrs, EmployeerMeta, never, never
>;

export type OutputEmployeerAttrs = EmployeerAttrs;
