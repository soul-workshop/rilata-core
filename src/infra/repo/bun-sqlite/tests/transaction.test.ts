import { describe, expect, test } from 'bun:test';
import { setAndGetTestStoreDispatcher } from '../../../../../tests/fixtures/test-thread-store-mock';
import { SqliteTestFixtures } from './fixtures';

describe('bun sqlite db transaction tests', () => {
  const db = new SqliteTestFixtures.BlogDatabase();
  const { resolver } = SqliteTestFixtures;
  db.init(resolver); // init and resolves db and repositories
  db.createDb(); // create sqlite db and tables
  db.open(); // open sqlite db

  const store = setAndGetTestStoreDispatcher({ moduleResolver: resolver });

  test('успех, транзакция двух репозиториев проходит успешно', () => {
    expect(true).toBe(false);
  });

  test('провал, первая транзакция происходит, вторая проваливается что приводит к отмене первого', () => {
    expect(true).toBe(false);
  });
});
