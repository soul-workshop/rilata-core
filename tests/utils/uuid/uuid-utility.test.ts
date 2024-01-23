/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { describe, test, expect } from 'bun:test';
import { AssertionException } from '../../../src/common/exeptions';
import { uuidUtility } from '../../../src/common/utils/uuid/uuid-utility';

describe('uuidUtility class test', () => {
  const incorrectUUID = '0dd856f7-c085-4c1b-8805-15ef64';
  const correctUUID = '0dd856f7-c085-4c1b-8805-15ef6469c177';
  const uuid = uuidUtility.getNewUUID();
  test('test getNewUUIDValue method returned value', () => {
    expect(typeof uuid).toBe('string');
  });

  test('test isValidValue method, is valid case', () => {
    expect(uuidUtility.isValidValue(correctUUID)).toBe(true);
    expect(uuidUtility.isValidValue(uuid)).toBe(true);
  });

  test('test isValidValue method, not valid value case', () => {
    expect(uuidUtility.isValidValue(incorrectUUID)).toBe(false);
    expect(uuidUtility.isValidValue(undefined)).toBe(false);
  });

  test('test cleanValue, validValue case', () => {
    expect(uuidUtility.cleanValue(uuid)).toBe(uuid);
  });

  test('test cleanValue method, throw exception case', () => {
    const cb = () => uuidUtility.cleanValue(incorrectUUID);
    // eslint-disable-next-line quotes
    expect(cb).toThrow(new AssertionException(`Значение ${incorrectUUID} не является валидным для типа UUID v4`));
  });
});
