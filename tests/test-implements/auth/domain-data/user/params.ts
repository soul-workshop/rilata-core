import { UuidType } from '../../../../../src/common/types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-object-data/params-types';
import { DomainMeta } from '../../../../../src/domain/domain-object-data/domain-types';

export type UserAttrs = {
  id: UuidType,
  emplyeerId: UuidType,
  passHash: string,
}

export type UserMeta = DomainMeta<'UserAR'>;

export type UserParams = AggregateRootDataParams<
  UserAttrs, UserMeta, never, never
>;

export type OutputUserAttrs = Omit<UserAttrs, 'passHash'>;
