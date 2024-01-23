import { IdType } from '../common/types';

export type AnonymousUser = {
  type: 'AnonymousUser',
};

export type DomainUser = {
  type: 'DomainUser',
  userId: IdType,
};

export type ModuleCaller = {
  type: 'ModuleCaller',
  name: string,
  user: AnonymousUser | DomainUser,
};

export type Caller = ModuleCaller | AnonymousUser | DomainUser;

export type CallerType = Caller['type'];
