import { describe, expect, test } from 'bun:test';

describe('bun sqlite db: add batch to db, and clear db tests', () => {
  describe('add batch to db tests', () => {
    test('успех, данные добавлены', () => {
      expect(true).toBe(false);
    });
  });

  describe('clear db tests', () => {
    test('успех, бд полностью очищена', () => {
      expect(true).toBe(false);
    });

    test('успех, бд полностью очищена, но таблица миграции не затрагивается', () => {
      expect(true).toBe(false);
    });
  });
});
