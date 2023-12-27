import { UserId } from '../../common/types';
import { GeneralARDParams } from '../domain-data/params-types';
import { AggregateRoot } from './aggregate-root';

export type GeneralAR = AggregateRoot<GeneralARDParams>;

export type GetARParams<AR extends GeneralAR> =
  AR extends AggregateRoot<infer T> ? T : never;

export type RoleAttrs = {
  userId: UserId
}

export type GroupRoleAttrs = {
  userIds: UserId[]
}
