import { GeneralArParams } from '#domain/domain-data/domain-types.js';
import { UserId } from '../../core/types.js';
import { AggregateRoot } from './aggregate-root.js';

export type GeneralAR = AggregateRoot<GeneralArParams>;

export type GetARParams<AR extends GeneralAR> =
  AR extends AggregateRoot<infer T> ? T : never;

export type RoleAttrs = {
  userId: UserId
}

export type GroupRoleAttrs = {
  userIds: UserId[]
}
