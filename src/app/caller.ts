import { IdType, UuidType } from '../common/types';

export type AnonymousUser = {
  type: 'AnonymousUser',
  requestID: UuidType,
};

export type DomainUser = {
  type: 'DomainUser',
  requestID: UuidType,
  userId: IdType,
};

export type ModuleCaller = {
  type: 'ModuleCaller',
  name: string,
  user: AnonymousUser | DomainUser,
};

export type Caller = ModuleCaller | AnonymousUser | DomainUser;

export type CallerType = Caller['type'];
