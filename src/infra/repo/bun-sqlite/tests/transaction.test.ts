import { describe, expect, test } from 'bun:test';
import { setAndGetTestStoreDispatcher } from '../../../../../tests/fixtures/test-thread-store-mock';
import { DomainUser } from '../../../../app/caller';
import { dodUtility } from '../../../../common/utils/domain-object/dod-utility';
import { uuidUtility } from '../../../../common/utils/uuid/uuid-utility';
import { SqliteTestFixtures } from './fixtures';

describe('bun sqlite db transaction tests', () => {
  const db = new SqliteTestFixtures.BlogDatabase();
  const { resolver } = SqliteTestFixtures;
  db.init(resolver); // init and resolves db and repositories
  db.createDb(); // create sqlite db and tables
  db.open(); // open sqlite db

  const sut = new SqliteTestFixtures.AddPostService();
  sut.init(resolver);

  const caller: DomainUser = {
    type: 'DomainUser',
    userId: '08ea51a1-6d14-42bf-81de-a94a809e3286',
  };
  const store = setAndGetTestStoreDispatcher({ caller, moduleResolver: resolver });

  test('успех, транзакция двух репозиториев проходит успешно', async () => {
    const requestDodAttrs: SqliteTestFixtures.AddPostServiceParams['input']['attrs'] = {
      name: 'Рецензия на пожалуй лучший фильм года "Итерстеллар"',
      body: 'Длинный текст с рецензией на фильм',
      category: 'cinema',
    };
    const requestDod = dodUtility.getRequestDod<SqliteTestFixtures.AddPostServiceParams['input']>('addPost', requestDodAttrs);

    const result = await sut.execute(requestDod);
    expect(result.isSuccess()).toBe(true);
    const value = result.value as SqliteTestFixtures.AddPostServiceParams['successOut'];
    expect(Object.keys(value)).toEqual(['postId']);
    expect(uuidUtility.isValidValue(value.postId)).toBe(true);

    const postRepo = SqliteTestFixtures.PostRepository.instance(resolver);
    const post = await postRepo.findPost(value.postId);
    expect(post).not.toBeUndefined();
    expect((post as SqliteTestFixtures.PostAttrs)).toEqual({
      postId: value.postId,
      name: 'Рецензия на пожалуй лучший фильм года "Итерстеллар"',
      body: 'Длинный текст с рецензией на фильм',
      category: 'cinema',
      authorId: caller.userId,
      published: false,
    });

    const userRepo = SqliteTestFixtures.UserRepository.instance(resolver);
    const user = await userRepo.findUser(caller.userId);
    expect(user).not.toBeUndefined();
    expect((user as SqliteTestFixtures.UserAttrs)).toEqual({
      userId: '08ea51a1-6d14-42bf-81de-a94a809e3286',
      login: 'Bill',
      hash: 'fff',
      posts: [value.postId],
    });
  });

  test('провал, первая транзакция происходит, вторая проваливается что приводит к отмене первого', () => {
    expect(true).toBe(false);
  });
});
