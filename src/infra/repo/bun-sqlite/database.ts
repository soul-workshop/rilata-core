/* eslint-disable no-use-before-define */
import { Database as SqliteDb } from 'bun:sqlite';
import { TestDatabase } from '../../../app/database/test.database';
import { TestRepository } from '../../../app/database/test.repository';
import { TestBatchRecords } from '../../../app/database/types';
import { GeneralModuleResolver } from '../../../app/module/types';
import { Logger } from '../../../common/logger/logger';
import { DTO } from '../../../domain/dto';
import { MigrationsSqliteRepository } from './repositories/migrations';
import { BunSqliteRepository } from './repository';
import { BunRepoCtor } from './types';

export class BunSqliteDatabase implements TestDatabase<false> {
  migrationRepo: MigrationsSqliteRepository;

  protected resolver!: GeneralModuleResolver;

  protected logger!: Logger;

  protected sqliteDbInstance: SqliteDb | undefined;

  get sqliteDb(): SqliteDb {
    if (this.sqliteDbInstance) return this.sqliteDbInstance;
    throw this.resolver.getLogger().error('database not opened');
  }

  protected repositories: BunSqliteRepository<string, DTO>[] = [];

  constructor(protected RepositoriesCtors: BunRepoCtor[]) {
    this.migrationRepo = new MigrationsSqliteRepository(this);
    this.repositories = RepositoriesCtors.map((Ctor) => new Ctor(this));
  }

  init(moduleResolver: GeneralModuleResolver): void {
    this.resolver = moduleResolver;
    this.logger = this.resolver.getLogger();
    this.migrationRepo.init(moduleResolver);
    this.repositories.forEach((repo) => repo.init(moduleResolver));
  }

  addRepository(repo: BunSqliteRepository<string, DTO>): void {
    this.repositories.push(repo);
  }

  /** Создать файл БД и таблицы. */
  createDb(): void {
    this.logger.info(`create db "${this.getFileName()}" for module: "${this.resolver.getModuleName()}" started`);
    this.openSqliteDb();
    this.createRepositories();
    this.migrateRepositories();
    this.logger.info(`create db "${this.getFileName()}" for module: "${this.resolver.getModuleName()}" finished`);
  }

  createRepositories(): void {
    this.migrationRepo.create();
    this.repositories.forEach((repo) => {
      repo.create();
      this.logger.info(`-| repo: "${repo.tableName}" successfully created`);
    });
  }

  migrateRepositories(): void {
    this.migrationRepo.migrate();
    this.repositories.forEach((repo) => {
      this.logger.info(`-| migrate for repo: "${repo.tableName}" started`);
      repo.migrate();
      this.logger.info(`-| migrate for repo: "${repo.tableName}" finished`);
    });
  }

  open(): void {
    this.openSqliteDb();
  }

  getRepository<R extends BunSqliteRepository<string, DTO>>(name: R['tableName']): R {
    const repo = this.repositories.find((r) => r.tableName === name);
    if (!repo) {
      throw this.resolver.getLogger().error(
        `cannot finded repository by name: "${name}"`,
      );
    }
    return repo as R;
  }

  addBatch<R extends TestRepository<string, DTO, false>>(
    batchRecords: TestBatchRecords<R>,
  ): void {
    Object.entries(batchRecords).map(([tableName, records]) => {
      const repo = this.getRepository(tableName);
      return repo.addBatch(records as DTO[]);
    });
  }

  clear(): void {
    const transaction = this.sqliteDb.transaction(() => {
      this.repositories.forEach((repo) => {
        if (repo.tableName !== 'migrations') {
          this.sqliteDb.run(`DELETE FROM ${repo.tableName}`);
        }
      });
    });
    transaction();
    this.logger.info(`sqlite db for module "${this.resolver.getModuleName()}" cleared`);
  }

  getFileName(): string {
    return '.sqlite';
  }

  getFilePath(): string {
    return this.resolver.getModulePath(); // default: path to module dir
  }

  getFullFileName(): string {
    return this.resolver.getServerResolver().getRunMode() === 'test'
      ? ':memory:'
      : `${this.getFilePath()}/${this.getFileName()}`;
  }

  stop(): void {
    this.sqliteDb?.close();
  }

  protected openSqliteDb(): void {
    if (!this.sqliteDbInstance) {
      this.sqliteDbInstance = new SqliteDb(this.getFullFileName());
      this.logger.info(`-| sqlite db by name "${this.getFileName()}" for module "${this.resolver.getModuleName()}" opened`);
    }
  }
}
