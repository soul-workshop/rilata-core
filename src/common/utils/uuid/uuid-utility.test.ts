/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AssertionException } from '../../exceptions';
import { UUIDUtility } from './uuid-utility';

describe('UUIDUtility class test', () => {
  const incorrectUUID = '0dd856f7-c085-4c1b-8805-15ef64';
  const correctUUID = '0dd856f7-c085-4c1b-8805-15ef6469c177';
  const uuid = UUIDUtility.getNewUUIDValue();
  test('test getNewUUIDValue method returned value', () => {
    expect(typeof uuid).toBe('string');
  });

  test('test isValidValue method, is valid case', () => {
    expect(UUIDUtility.isValidValue(correctUUID)).toBe(true);
    expect(UUIDUtility.isValidValue(uuid)).toBe(true);
  });

  test('test isValidValue method, not valid value case', () => {
    expect(UUIDUtility.isValidValue(incorrectUUID)).toBe(false);
    expect(UUIDUtility.isValidValue(undefined)).toBe(false);
  });

  test('test cleanValue, validValue case', () => {
    expect(UUIDUtility.cleanValue(uuid)).toBe(uuid);
  });

  test('test cleanValue method, throw exception case', () => {
    const cb = () => UUIDUtility.cleanValue(incorrectUUID);
    expect(cb).toThrow(AssertionException);
  });
});
