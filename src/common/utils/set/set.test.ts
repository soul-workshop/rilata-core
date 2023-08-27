import { intersection, difference, union } from './set';

describe('Set', () => {
  test('test intersection', async () => {
    expect(intersection(new Set([1, 2]), new Set([4, 5]))).toMatchObject(new Set());
    expect(intersection(new Set([1, 2]), new Set([4, '']))).toMatchObject(new Set());
    expect(intersection(new Set([1, 2]), new Set([4, 1]))).toMatchObject(new Set([1]));
    expect(intersection(new Set(['dasfsd', 2, 'ok', 4]), new Set([4, 'sdafsd', 'ok'])))
      .toMatchObject(new Set(['ok', 4]));
  });

  test('test union', async () => {
    expect(union(new Set([1, 2]), new Set([4, 5]))).toMatchObject(new Set([1, 2, 4, 5]));
    expect(union(new Set([1, 2]), new Set([4, '']))).toMatchObject(new Set([1, 2, 4, '']));
    expect(union(new Set([1, 2]), new Set([4, 1]))).toMatchObject(new Set([4, 1, 2]));
    expect(union(new Set(['dasfsd', 2, 'ok', 4]), new Set([4, 'sdafsd', 'ok'])))
      .toMatchObject(new Set(['dasfsd', 2, 'ok', 4, 'sdafsd']));
  });

  test('test difference', async () => {
    expect(difference(new Set([1, 2]), new Set([4, 5]))).toMatchObject(new Set([1, 2]));
    expect(difference(new Set([1, 2]), new Set([4, '']))).toMatchObject(new Set([1, 2]));
    expect(difference(new Set([1, 2]), new Set([4, 1]))).toMatchObject(new Set([2]));
    expect(difference(new Set(['dasfsd', 2, 'ok', 4]), new Set([4, 'sdafsd', 'ok'])))
      .toMatchObject(new Set(['dasfsd', 2]));
  });

//   afterAll(async () => { });
});
