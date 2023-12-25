/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally me)
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];

interface Person {
  name: string;
  age: number;
  surname: string;
  children: number;
}

type Result = UnionToArray<keyof Person>; // ["name", "age", "surname", "children"]

const func = <T, >(): UnionToArray<keyof T> => null as any;

const result = func<Person>(); // ["name", "age", "surname", "children"]
