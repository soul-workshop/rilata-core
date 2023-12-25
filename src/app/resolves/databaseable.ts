import { Database } from '../database';

export interface Databaseable {
  getDatabase(): Database
}
