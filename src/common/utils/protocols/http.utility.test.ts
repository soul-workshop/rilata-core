import { AssertionException } from '../../exceptions';
import { httpUtility } from './http.utility';

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
      .toThrowError(AssertionException);
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
      .toThrowError(AssertionException);
  });
});
