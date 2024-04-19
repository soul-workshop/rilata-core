import { describe, test, expect } from 'bun:test';
import { MigrateRow } from '../types';
import { SqliteTestFixtures } from './fixtures';

describe('sqlite create and migrate tests', () => {
  const db = new SqliteTestFixtures.BlogDatabase();
  const { resolver } = SqliteTestFixtures;
  db.init(resolver); // init and resolves db and repositories
  db.createDb(); // create sqlite db and tables
  db.open(); // open sqlite db

  test('успех. бд и таблицы созданы', () => {
    const tableNamesAsArrObj = db.sqliteDb.query('select name from sqlite_master where type="table"').all();
    const tableNames = tableNamesAsArrObj.map((tName) => (tName as any).name);
    expect(tableNames).toEqual(['migrations', 'users', 'posts', 'events']);
  });

  test('успех, поля таблицы migrations добавлены', () => {
    const migrColAsArrObj = db.sqliteDb.query('PRAGMA table_info("migrations")').all();
    const migrColNames = migrColAsArrObj.map((col) => (col as any).name);
    expect(migrColNames).toEqual(['id', 'description', 'sql', 'tableName', 'migratedAt']);
  });

  test('успех, поля таблицы events добавлены', () => {
    const colAsArrObj = db.sqliteDb.query('PRAGMA table_info("events")').all();
    const colNames = colAsArrObj.map((col) => (col as any).name);
    expect(colNames).toEqual(['id', 'name', 'payload', 'requestId', 'isPublished', 'aRootName', 'aRootId']);
  });

  test('успех, поля таблицы users добавлены', () => {
    const colAsArrObj = db.sqliteDb.query('PRAGMA table_info("users")').all();
    const colNames = colAsArrObj.map((col) => (col as any).name);
    expect(colNames).toEqual(['userId', 'login', 'hash']);
  });

  test('успех, поля таблицы posts добавлены, миграция сработала', () => {
    const postColAsArrObj = db.sqliteDb.query('PRAGMA table_info("posts")').all();
    const postColNames = postColAsArrObj.map((col) => (col as any).name);
    expect(postColNames).toEqual(['postId', 'name', 'body', 'authorId', 'category']);

    const migrations = db.sqliteDb.query('SELECT * FROM migrations').all();
    expect(migrations.length).toBe(1);
    expect((migrations as MigrateRow[])[0].id).toBe('9c3b4923-20e3-4d29-bf37-8170103d49c0');
  });

  test('провал, миграция таблицы и запись в таблицу миграции проходит в одной транзакции', () => {
    class FailMigratePostRepository extends SqliteTestFixtures.PostRepository {
      getMigrationSql(migration: MigrateRow): string {
        const { id, description, sql } = migration;
        // last column value is null => fail;
        return `INSERT INTO migrations VALUES ('${id}', '${description}', '${sql}', 'posts', null)`;
      }
    }
    class FailBlogDatabase extends SqliteTestFixtures.BlogDatabase {
      protected repositoryCtors = [
        SqliteTestFixtures.UserRepository,
        FailMigratePostRepository,
      ];
    }

    const failDb = new FailBlogDatabase();
    failDb.init(resolver);
    try {
      failDb.createDb();
      throw Error('not be called');
    } catch (e) {
      expect(String(e)).toBe('Error: fail migrate "add post category column" row');
    }

    const postColAsArrObj = failDb.sqliteDb.query('PRAGMA table_info("posts")').all();
    const postColNames = postColAsArrObj.map((col) => (col as any).name);
    // not added column
    expect(postColNames).toEqual(['postId', 'name', 'body', 'authorId']);

    const migrations = failDb.sqliteDb.query('SELECT * FROM migrations').all();
    // not added in migrations table
    expect(migrations.length).toBe(0);
  });

  test('успех, повторное выполнение миграции не приводит к эффекту', () => {
    function checkMigrate(): void {
      const sql = 'SELECT id FROM migrations';
      const migrationRecords = db.sqliteDb.query(sql).all();
      expect(migrationRecords.length).toBe(1);
      expect(migrationRecords).toEqual([
        { id: '9c3b4923-20e3-4d29-bf37-8170103d49c0' },
      ]);
    }

    checkMigrate();
    db.migrateRepositories();
    checkMigrate();
  });
});
