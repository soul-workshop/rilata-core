import { TestRepository } from '../../../app/database/test-repository';
import { GeneralModuleResolver } from '../../../app/module/types';
import { Logger } from '../../../common/logger/logger';
import { DTO } from '../../../domain/dto';
import { BunSqliteDatabase } from './database';
import { MigrateRow } from './types';

export abstract class BunSqliteRepository<
  TN extends string, R extends DTO
> implements TestRepository<TN, R> {
  abstract tableName: TN;

  protected resolver!: GeneralModuleResolver;

  protected logger!: Logger;

  abstract migrationWRows: MigrateRow[];

  /** Создать таблицу в БД */
  abstract create(): void

  constructor(protected db: BunSqliteDatabase) {}

  async clear(): Promise<void> {
    this.db.sqliteDb.run(`DELETE FROM ${this.tableName}`);
  }

  init(resolver: GeneralModuleResolver): void {
    this.resolver = resolver;
    this.logger = resolver.getLogger();
  }

  async addBatch(records: R[]): Promise<void> {
    if (records.length === 0) return;
    const colNames = this.getColumnNames(records);

    const sql = `INSERT INTO ${this.tableName} (${colNames.join(', ')}) VALUES ${this.getRecordValues(colNames, records)}`;
    this.db.sqliteDb.run(sql);
  }

  protected getColumnNames(records: R[]): (keyof R)[] {
    const set = new Set<keyof R>();
    records.forEach((rec) => Object.keys(rec).forEach((key) => set.add(key)));
    return Array.from(set);
  }

  protected getRecordValues(colNames: (keyof R)[], records: R[]): string {
    return records
      .map((rec) => colNames.map((nm) => this.castRecordValue(rec[nm])).join(', '))
      .map((recAsStr) => `(${recAsStr})`)
      .join(', ');
  }

  protected castRecordValue(value: unknown): unknown {
    const type = typeof value;
    if (type === 'string') return `"${value}"`;
    if (type === 'boolean') return value ? 1 : 0;
    if (type === 'undefined') return 'null';
    return value;
  }

  /** Выполнить миграцию для репозитория */
  migrate(): void {
    this.migrationWRows.forEach((migration) => {
      const migrTblName = this.db.migrationRepo.tableName;
      const query = this.db.sqliteDb.query(
        `SELECT * FROM ${migrTblName} WHERE id=?`,
      );
      const rowIsMigrated = query.get(migration.id);
      if (!rowIsMigrated) {
        try {
          const transation = this.db.sqliteDb.transaction(() => {
            this.db.sqliteDb.run(migration.sql);
            this.db.sqliteDb.run(this.getMigrationSql(migration));
          });
          transation();
          this.logger.info(`---| migrate "${migration.description}" successfully processed`);
        } catch (e) {
          throw this.logger.error(
            `fail migrate "${migration.description}" row`,
            migration,
            e as Error,
          );
        }
      }
    });
  }

  protected getMigrationSql(migration: MigrateRow): string {
    const { id, description, sql } = migration;
    return `INSERT INTO migrations VALUES ('${id}', '${description}', '${sql}', '${this.tableName}', unixepoch('now'))`;
  }
}