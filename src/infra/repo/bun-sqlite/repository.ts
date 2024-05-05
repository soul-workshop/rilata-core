import { SQLQueryBindings } from 'bun:sqlite';
import { storeDispatcher } from '../../../app/async-store/store-dispatcher';
import { TestRepository } from '../../../app/database/test-repository';
import { GeneralModuleResolver } from '../../../app/module/types';
import { Logger } from '../../../common/logger/logger';
import { UuidType } from '../../../common/types';
import { dtoUtility } from '../../../common/utils/dto/dto-utility';
import { DTO } from '../../../domain/dto';
import { BunSqliteDatabase } from './database';
import { BunSqliteTransactionData, MigrateRow } from './types';

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

    const colNames = dtoUtility.getUniqueKeys(records);
    const rawNames = colNames.join(', ');
    const rawValues = colNames.map((n) => `$${n}`).join(',');

    const sql = `INSERT INTO ${this.tableName} (${rawNames}) VALUES (${rawValues})`;
    const transaction = this.db.sqliteDb.transaction(() => {
      records.forEach((rec) => {
        // почему то без приведения выводит ошибку типов!!!
        const bindings = this.getObjectBindings(rec) as unknown as SQLQueryBindings[];
        this.db.sqliteDb.prepare(sql, bindings).run();
      });
    });
    transaction();
  }

  /** Возвращает объект приведенный для привязки */
  protected getObjectBindings(obj: Record<string, unknown>): SQLQueryBindings {
    const casted = dtoUtility.editValues(obj, (v) => this.castValue(v));
    return dtoUtility.editKeys(casted, (k) => `$${k}`);
  }

  protected castValue(value: unknown): string | number | boolean | null {
    if (
      typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    || value === null
    ) return value;
    if (value === undefined) return null;
    return `"${JSON.stringify(value)}"`;
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
