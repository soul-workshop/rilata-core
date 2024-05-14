import { IdType } from '../../common/types';

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

export type ResultDTO<FAIL, SUCCESS> = {
  success: false,
  httpStatus: number,
  payload: FAIL,
} | {
  success: true,
  httpStatus: number,
  payload: SUCCESS,
};

export type RilataRequest =
  Request
  & { caller: Caller }
  & { headers: Headers & { Authorization: string } }
