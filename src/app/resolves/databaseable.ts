import { Database } from '../database/database';

export interface Databaseable {
  getDatabase(): Database
}
