/**
 * Преобразует tuple ['a', 'b', 'c'] в объект {0: 'a', 1: 'b', 2: 'c'}.
 */
export type TupleToObject<T extends unknown[]> = {
  [K in keyof T as Exclude<K, keyof unknown[]>]: T[K]
};

/**
 * Преобразует tuple ['a', 'b', 'c']
 * с переданным параметром N = {0: 'aKey', 1: 'bKey', 2: 'cKey'} или ['aKey', 'bKey', 'cKey']
 * в объект {aKey: 'a', bKey: 'b', cKey: 'c'}.
 */
export type TupleToObjectWithPropNames<
  T extends unknown[],
  N extends Record<keyof TupleToObject<T>, PropertyKey>,
  > = {
    [K in keyof TupleToObject<T> as N[K]]: T[K]
  };

/**
 * Удаляет из кортежа первый элемент.
 */
export type RemoveFirstFromTuple<
  T extends unknown[]
> = T['length'] extends 0
  ? never
  : (((...b: T) => void) extends (a: infer F, ...b: infer I) => void ? I : []);
