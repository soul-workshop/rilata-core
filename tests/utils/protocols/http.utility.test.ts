import { describe, test, expect } from 'bun:test';
import { httpUtility } from '../../../src/common/utils/protocols/http.utility';
import { AssertionException } from '../../../src/common/exeptions';

describe('Тестирование HTTPUtility', () => {
  test('Успешное кодирование', () => {
    expect(httpUtility.encodeArrayQueryParam(['a', 'b', 'c', 'd', 'e', 'f']))
      .toEqual('a,b,c,d,e,f');
  });

  test('Успешное кодирование: пустой массив', () => {
    expect(httpUtility.encodeArrayQueryParam([]))
      .toEqual('');
  });

  test('Успешное кодирование: 1 элемент', () => {
    expect(httpUtility.encodeArrayQueryParam(['a']))
      .toEqual('a');
  });

  test('Неуспешное кодирование: передан не массив', () => {
    expect(() => httpUtility.encodeArrayQueryParam(true as unknown as unknown[]))
      .toThrow(new AssertionException('В HTTPUtility.encodeArrayQueryParam аргументом передан не массив.'));
  });

  test('Успешное декодирование', () => {
    expect(httpUtility.decodeArrayQueryParam('a,b,c,d,e,f'))
      .toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  test('Успешное декодирование: пустая строка', () => {
    expect(httpUtility.decodeArrayQueryParam(''))
      .toEqual([]);
  });

  test('Успешное декодирование: 1 элемент', () => {
    expect(httpUtility.decodeArrayQueryParam('a'))
      .toEqual(['a']);
  });

  test('Неуспешное декодирование: передана не строка', () => {
    expect(() => httpUtility.decodeArrayQueryParam(true as unknown as string))
      .toThrow(new AssertionException('В HTTPUtility.decodeArrayQueryParam аргументом передана не строка.'));
  });
});
