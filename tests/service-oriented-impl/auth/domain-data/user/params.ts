import { UuidType } from '../../../../../src/common/types';
import { AggregateRootParams, ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';

export type UserAttrs = {
  userId: UuidType,
  personIin: string,
}

export type UserMeta = DomainMeta<'UserAR', 'userId'>;

export type UserParams = AggregateRootParams<
  UserAttrs, UserMeta, never, []
>;

export type UserARDT = ARDT<UserAttrs, UserMeta, []>;
