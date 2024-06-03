import { UserId } from '../../core/types';
import { GeneralArParams } from '../index';
import { AggregateRoot } from './aggregate-root';

export type GeneralAR = AggregateRoot<GeneralArParams>;

export type GetARParams<AR extends GeneralAR> =
  AR extends AggregateRoot<infer T> ? T : never;

export type RoleAttrs = {
  userId: UserId
}

export type GroupRoleAttrs = {
  userIds: UserId[]
}
