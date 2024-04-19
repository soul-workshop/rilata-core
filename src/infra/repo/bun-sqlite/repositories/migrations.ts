/* eslint-disable @typescript-eslint/no-empty-function */
import { BunSqliteRepository } from '../repository';
import { MigrateRow } from '../types';

export class MigrationsRepository extends BunSqliteRepository<'migrations', MigrateRow> {
  tableName = 'migrations' as const;

  migrationWRows: MigrateRow[] = [];

  create(): void {
    this.db.sqliteDb.run(
      `CREATE TABLE ${this.tableName} (
        id TEXT PRIMARY KEY NOT NULL,
        description TEXT NOT NULL,
        sql TEXT NOT NULL,
        tableName TEXT NOT NULL,
        migratedAt INTEGER NOT NULL
      );`,
    );
  }

  async clear(): Promise<void> {} // записи таблицы миграции не очищаются
}
