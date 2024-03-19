import { Caller } from '../caller';

export type RilataRequest =
  Request
  & { caller: Caller }
  & { headers: Headers & { Authorization: string } }
