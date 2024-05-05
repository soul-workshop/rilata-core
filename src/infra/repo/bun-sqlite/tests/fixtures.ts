/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import { storeDispatcher } from '../../../../app/async-store/store-dispatcher';
import { DomainUser } from '../../../../app/caller';
import { EventRepository } from '../../../../app/database/event-repository';
import { TestBatchRecords } from '../../../../app/database/types';
import { GeneralModuleResolver } from '../../../../app/module/types';
import { Repositoriable } from '../../../../app/resolves/repositoriable';
import { UowCommandService } from '../../../../app/service/command-service';
import { CommandServiceParams, RequestDodValidator, ServiceResult } from '../../../../app/service/types';
import { DatabaseObjectSavingError } from '../../../../common/exeptions';
import { ConsoleLogger } from '../../../../common/logger/console-logger';
import { getLoggerMode } from '../../../../common/logger/logger-modes';
import { success } from '../../../../common/result/success';
import { UuidType } from '../../../../common/types';
import { dodUtility } from '../../../../common/utils/domain-object/dod-utility';
import { dtoUtility } from '../../../../common/utils/dto/dto-utility';
import { TupleToUnion } from '../../../../common/utils/tuple/types';
import { uuidUtility } from '../../../../common/utils/uuid/uuid-utility';
import { ARDT, DomainMeta, EventDod, GeneralEventDod, RequestDod } from '../../../../domain/domain-data/domain-types';
import { AggregateRootDataParams } from '../../../../domain/domain-data/params-types';
import { DtoFieldValidator } from '../../../../domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../domain/validator/field-validator/literal-field-validator';
import { StringChoiceValidationRule } from '../../../../domain/validator/rules/validate-rules/string/string-choice.v-rule';
import { BunSqliteDatabase } from '../database';
import { EventRepositorySqlite } from '../repositories/event';
import { BunSqliteRepository } from '../repository';
import { MigrateRow } from '../types';

export namespace SqliteTestFixtures {
  // ++++++++++++++++++ database and repositories section ++++++++++++++++++++

  export class BlogDatabase extends BunSqliteDatabase {
    protected repositoryCtors = [
      UserRepositorySqlite,
      PostRepositorySqlite,
      EventRepositorySqlite,
    ];
  }

  export type UserAttrs = {
    userId: string,
    login: string,
    hash: string,
    posts: UuidType[],
  }

  export type UserRecord = {
    userId: string,
    login: string,
    hash: string,
    posts: string,
  }

  export interface UserRepository {
    init(resolver: GeneralModuleResolver): void
    addPost(userId: string, postId: UuidType): Promise<void>
    findUser(userId: UuidType): Promise<UserAttrs | undefined>
  }

  export const UserRepository = {
    instance(repositoriable: Repositoriable): UserRepository {
      return repositoriable.resolveRepo(UserRepository) as UserRepository;
    },
  };

  export class UserRepositorySqlite extends BunSqliteRepository<'users', UserAttrs> implements UserRepository {
    tableName = 'users' as const;

    migrationWRows: MigrateRow[] = [];

    create(): void {
      this.db.sqliteDb.run(
        `CREATE TABLE ${this.tableName} (
          userId TEXT PRIMARY KEY,
          login TEXT(50) NOT NULL,
          hash TEXT NOT NULL,
          posts TEXT DEFAULT ""
        );`,
      );
    }

    async addPost(userId: UuidType, postId: UuidType): Promise<void> {
      if (uuidUtility.isValidValue(postId) === false) {
        throw this.logger.error(`not valid post id: ${postId}`);
      }
      const userAttrs = this.db.sqliteDb.query(
        `SELECT userId, posts FROM ${this.tableName} WHERE userId="${userId}"`,
      ).get() as { userId: string, posts: string };
      if (!userAttrs) {
        throw this.logger.error(`not finded user by id: ${userId}`);
      }
      const posts = userAttrs.posts.split(',');
      posts.push(postId);
    }

    async findUser(userId: string): Promise<UserAttrs | undefined> {
      const sql = `SELECT * from ${this.tableName} WHERE userId="${userId}"`;
      const attrs = this.db.sqliteDb.query(sql).get() as UserRecord | null;
      if (!attrs) return undefined;
      return this.recordToAttrs(attrs);
    }

    protected recordToAttrs(rec: UserRecord): UserAttrs {
      const posts = JSON.parse(rec.posts) as string[];
      return { ...rec, posts };
    }
  }

  const postCategories = ['music', 'cinema', 'art'] as const;

  type PostCategories = TupleToUnion<typeof postCategories>;

  export type PostAttrs = {
    postId: string,
    name: string,
    body: string,
    desc?: string,
    category: PostCategories,
    authorId: string,
    published: boolean,
  }

  export type PostRecord = PostAttrs & {
    version: number,
  }

  type PostDomainMeta = DomainMeta<'PostAr', 'postId'>

  type PostArParams = AggregateRootDataParams<PostAttrs, PostDomainMeta, never, []>

  type PostARDT = ARDT<PostAttrs, PostDomainMeta>

  export interface PostRepository {
    init(resolver: GeneralModuleResolver): void
    addPost(attrs: Omit<PostAttrs, 'published'>): Promise<void>
    findPost(postId: UuidType): Promise<PostAttrs | undefined>
  }

  export const PostRepository = {
    instance(repositoriable: Repositoriable): PostRepository {
      return repositoriable.resolveRepo(PostRepository) as PostRepository;
    },
  };

  export class PostRepositorySqlite
    extends BunSqliteRepository<'posts', PostRecord>
    implements PostRepository {
    tableName = 'posts' as const;

    migrationWRows: MigrateRow[] = [
      {
        id: '9c3b4923-20e3-4d29-bf37-8170103d49c0',
        description: 'add post category column',
        sql: 'ALTER TABLE posts ADD COLUMN category NOT NULL CHECK (category=="music" OR category=="cinema" OR category=="art") DEFAULT "music"',
      },
    ];

    create(): void {
      const sql = `CREATE TABLE ${this.tableName} (
        postId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        body TEXT NOT NULL,
        desc TEXT,
        authorId TEXT NOT NULL,
        published BOOLEAN DEFAULT 0 NOT NULL,
        version INTEGER DEFAULT 0 NOT NULL
      );`;
      this.db.sqliteDb.run(sql);
    }

    addPost(attrs: Omit<PostAttrs, 'published'>): Promise<void> {
      throw new Error('Method not implemented.');
    }

    findPost(postId: string): Promise<PostAttrs | undefined> {
      throw new Error('Method not implemented.');
    }
  }

  // ++++++++++++++++++ service section ++++++++++++++++++++

  type AddPostRequestDodAttrs = {
    name: string,
    body: string,
    desc?: string,
    category: PostCategories,
  }

  type AddPostRequestDod = RequestDod<'addPost', AddPostRequestDodAttrs>

  type AddPostOut = { postId: UuidType }

  type PostAddedEvent = EventDod<'PostAdded', AddPostRequestDodAttrs, PostARDT>

  export type AddPostServiceParams = CommandServiceParams<
    PostArParams,
    AddPostRequestDod,
    AddPostOut,
    never,
    PostAddedEvent[]
  >

  const addPostValidator: RequestDodValidator<AddPostServiceParams> = new DtoFieldValidator(
    'addPost', true, { isArray: false }, 'dto', {
      name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', []),
      body: new LiteralFieldValidator('body', true, { isArray: false }, 'string', []),
      category: new LiteralFieldValidator('category', true, { isArray: false }, 'string', [
        new StringChoiceValidationRule(postCategories),
      ]),
      desc: new LiteralFieldValidator('desc', false, { isArray: false }, 'string', []),
    },
  );

  export class AddPostService extends UowCommandService<AddPostServiceParams> {
    serviceName = 'addPost' as const;

    aRootName = 'PostAr' as const;

    protected supportedCallers = ['DomainUser'] as const;

    protected validator = addPostValidator;

    protected async runDomain(input: AddPostRequestDod): Promise<ServiceResult<AddPostServiceParams>> {
      const caller = storeDispatcher.getStoreOrExepction().caller as DomainUser;
      const postId = uuidUtility.getNewUUID();

      const userRepo = UserRepository.instance(this.moduleResolver);
      const postRepo = PostRepository.instance(this.moduleResolver);
      const eventRepo = EventRepository.instance(this.moduleResolver);
      try {
        await userRepo.addPost(caller.userId, postId);

        const postAttrs: PostAttrs = {
          postId,
          ...input.attrs,
          authorId: caller.userId,
          published: false,
        };
        await postRepo.addPost(postAttrs);

        const postArdt: PostARDT = {
          attrs: { ...postAttrs, published: false },
          meta: {
            name: 'PostAr',
            idName: 'postId',
            domainType: 'aggregate',
            version: 0,
          },
        };
        const event = dodUtility.getEvent<PostAddedEvent>('PostAdded', input.attrs, postArdt);
        await eventRepo.addEvents([event]);
      } catch (e) {
        this.logger.error('')
        throw new DatabaseObjectSavingError('fail add user post or post record to repository');
      }

      return success({ postId });
    }

    protected throwErr(errStr: string, attrs: unknown): never {
      throw this.moduleResolver.getLogger().error(errStr, attrs);
    }
  }

  // ++++++++++++++++++ resolver mock section ++++++++++++++++++++
  const db = new BlogDatabase();
  const userRepo = new UserRepositorySqlite(db);
  const postRepo = new PostRepositorySqlite(db);
  const eventRepo = new EventRepositorySqlite(db);

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

    resolveRepo(key: unknown): unknown {
      if (key === UserRepository) return userRepo;
      if (key === PostRepository) return postRepo;
      if (key === EventRepository) return eventRepo;
      throw Error(`not found key: ${key}`);
    },

    getDatabase(): typeof db {
      return db;
    },
  } as unknown as GeneralModuleResolver;

  // ++++++++++++++++++ fixture data section ++++++++++++++++++++

  export const userAttrs: UserAttrs = {
    userId: 'e4aaf44c-f727-4b00-b9e1-fcba0feb98c0',
    login: 'Nick',
    hash: 'fff',
    posts: [],
  };
  export const userArAttrs = {
    ...userAttrs,
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
      attrs: userAttrs,
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

  export const batchRecords: TestBatchRecords<UserRepositorySqlite | PostRepositorySqlite> = {
    users: [
      {
        userId: '08ea51a1-6d14-42bf-81de-a94a809e3286',
        login: 'Bill',
        hash: 'fff',
        posts: [],
      },
      {
        userId: '38d929f5-d20d-47f3-8844-eb1986ee46ae',
        login: 'f1rstFx',
        hash: 'hhh',
        posts: ['3ee45022-4253-4dbe-9da0-80db931184cc'],
      },
      {
        userId: '131b499e-927d-477c-9d97-c2ae6104985e',
        login: 'Nick',
        hash: 'ccc',
        posts: ['09cdf3d6-93ef-44be-8a3d-2e9da3982049', 'fb369b27-ec5e-452f-b454-e48db4bf6ab4'],
      },
    ],
    posts: [
      {
        postId: '09cdf3d6-93ef-44be-8a3d-2e9da3982049',
        name: 'About thinks',
        body: 'very long text about thinks',
        category: 'cinema',
        authorId: '131b499e-927d-477c-9d97-c2ae6104985e',
        published: true,
        version: 0,
      },
      {
        postId: '3ee45022-4253-4dbe-9da0-80db931184cc',
        name: 'Film Interstellar',
        body: 'long recense',
        desc: 'very nice film',
        category: 'cinema',
        authorId: '38d929f5-d20d-47f3-8844-eb1986ee46ae',
        published: false,
        version: 0,
      },
      {
        postId: 'fb369b27-ec5e-452f-b454-e48db4bf6ab4',
        name: 'Avatar not cool film, imho',
        body: 'long recense',
        category: 'cinema',
        authorId: '131b499e-927d-477c-9d97-c2ae6104985e',
        published: false,
        version: 0,
      },
    ],
  };
}
