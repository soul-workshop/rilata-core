import { UuidType } from '../../../../../src/common/types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-data/params-types';
import { ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';

export type UserAttrs = {
  userId: UuidType,
  personIin: string,
}

export type UserMeta = DomainMeta<'UserAR'>;

export type UserParams = AggregateRootDataParams<
  UserAttrs, UserMeta, never, []
>;

export type UserARDT = ARDT<UserAttrs, UserMeta>;
