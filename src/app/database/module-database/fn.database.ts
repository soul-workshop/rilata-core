import { Database } from '../database';

export interface FnDatabase extends Database {
  transaction<ARGS extends unknown[], RTRN>(fn: (...args: ARGS) => RTRN, ...args: ARGS): RTRN
}
