/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import { GeneralModuleResolver } from '../../../../app/module/types';
import { ConsoleLogger } from '../../../../common/logger/console-logger';
import { getLoggerMode } from '../../../../common/logger/logger-modes';
import { GeneralEventDod } from '../../../../domain/domain-data/domain-types';
import { BunSqliteDatabase } from '../database';
import { SqliteEventRepository } from '../repositories/event';
import { BunSqliteRepository } from '../repository';
import { MigrateRow } from '../types';

export namespace SqliteTestFixtures {
  export const resolver = {
    getDirPath(): string {
      // @ts-ignore
      return import.meta.dir;
    },

    getRunMode(): 'test' | 'prod' {
      return 'test';
    },

    getLogger() {
      return new ConsoleLogger(getLoggerMode());
    },

    getModuleName(): string {
      return 'SubjectModule';
    },
  } as unknown as GeneralModuleResolver;

  export class BlogDatabase extends BunSqliteDatabase {
    protected repositoryCtors = [
      UserRepository,
      PostRepository,
      SqliteEventRepository,
    ];
  }

  export type UserAttrs = {
    userId: string,
    login: string,
    passHash: string,
  }

  export type UserRecord = UserAttrs & {
    version: number,
  }

  export class UserRepository extends BunSqliteRepository<'users', UserRecord> {
    tableName = 'users' as const;

    migrationWRows: MigrateRow[] = [];

    create(): void {
      this.db.sqliteDb.run(
        `CREATE TABLE ${this.tableName} (
          userId TEXT PRIMARY KEY,
          login TEXT(50) NOT NULL,
          hash TEXT NOT NULL
        );`,
      );
    }
  }

  export type PostAttrs = {
    postId: string,
    name: string,
    body: string,
    category: 'music' | 'cinema' | 'art',
    authorId: string,
  }

  export type PostRecord = PostAttrs & {
    version: number,
  }

  export class PostRepository extends BunSqliteRepository<'posts', PostRecord> {
    tableName = 'posts' as const;

    migrationWRows: MigrateRow[] = [
      {
        id: '9c3b4923-20e3-4d29-bf37-8170103d49c0',
        description: 'add post category column',
        sql: 'ALTER TABLE posts ADD COLUMN category NOT NULL CHECK (category=="music" OR category=="cinema" OR category=="art") DEFAULT "music"',
      },
    ];

    create(): void {
      this.db.sqliteDb.run(
        `CREATE TABLE ${this.tableName} (
          postId TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          body TEXT NOT NULL,
          authorId TEXT NOT NULL
        );`,
      );
    }
  }

  export const userAttrs = { userId: 'e4aaf44c-f727-4b00-b9e1-fcba0feb98c0', telegramId: 555 };
  export const userProfileAttrs = {
    login: 'Nur',
    nickName: 'Nur',
    name: 'Nurbolat',
  };
  export const userArAttrs = {
    ...userAttrs,
    profile: userProfileAttrs,
  };

  export const events: GeneralEventDod[] = [
    {
      attrs: userAttrs,
      meta: {
        eventId: '35c226f6-a150-4987-9b15-1ed3f52f90fa',
        requestId: '7300da3b-545c-492c-b31b-213c02620ed5',
        name: 'addUser',
        moduleName: 'SubjectModule',
        domainType: 'event',
        created: 1712388395101,
      },
      caller: {
        type: 'DomainUser',
        userId: 'e1114dde-1230-4408-b910-ad7532ffd38c',
      },
      aRoot: {
        attrs: userArAttrs,
        meta: {
          idName: 'userId',
          version: 0,
          name: 'UserAr',
          domainType: 'aggregate',
        },
      },
    },
    {
      attrs: userProfileAttrs,
      meta: {
        eventId: 'de63b084-e565-4090-8972-225f36cd6c2b',
        requestId: '7300da3b-545c-492c-b31b-213c02620ed5',
        name: 'userProfileCreated',
        moduleName: 'SubjectModule',
        domainType: 'event',
        created: 1712388395101,
      },
      caller: {
        type: 'DomainUser',
        userId: 'e1114dde-1230-4408-b910-ad7532ffd38c',
      },
      aRoot: {
        attrs: userArAttrs,
        meta: {
          idName: 'userId',
          version: 0,
          name: 'UserAr',
          domainType: 'aggregate',
        },
      },
    },
  ];
}
