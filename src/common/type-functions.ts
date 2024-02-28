/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { DTO } from '../domain/dto';
import { UnionToArray } from './utils/tuple/types';

/**
 * По ключам REPLACEDKEYS заменяет значения атрибутов объекта OBJECT
 * новыми значениями из объекта NEWVALUES.
 */
export type ReplaceAttrsValues<
  OBJECT,
  REPLACEDKEYS extends keyof OBJECT,
  NEWVALUES extends Record<REPLACEDKEYS, unknown>
> = {
    [K in keyof OBJECT]: K extends REPLACEDKEYS ? NEWVALUES[K] : OBJECT[K];
};

/** извлекает из объекта ключи в точечной нотации
const a = {
  a?: {
    b?: {
      c: 'c',
    },
    d: [5],
  }
}
const b: GetDtoKeysByDotNotation<typeof a> //  'a | a.b | a.b.c' | 'a.d'
*/
export type GetDtoKeysByDotNotation<ObjectType extends DTO> =
{[Key in keyof ObjectType & string]: NonNullable<ObjectType[Key]> extends Array<infer T>
  ? T extends object
    ? `${Key}` | `${Key}.${GetDtoKeysByDotNotation<NonNullable<T>>}`
    : `${Key}`
  : NonNullable<ObjectType[Key]> extends object
    ? `${Key}` | `${Key}.${GetDtoKeysByDotNotation<NonNullable<ObjectType[Key]>>}`
    : `${Key}`
}[keyof ObjectType & string];

/** Возвращает keyof T, из которых исключены атрибуты K.
* Передав массив полей ([...keys] as const) можно ислкючить несколько атрибутов. */
export type GetDtoKeys<T extends DTO, K extends keyof T | ReadonlyArray<keyof T> > =
  K extends keyof T
    ? K
    : K extends ReadonlyArray<keyof T>
      ? K[number]
      : never;

export type ExcludeDtoAttrs<
  T extends DTO,
  K extends keyof T | ReadonlyArray<keyof T>
> = Omit<T, GetDtoKeys<T, K>>;

/** Возвращает объединенный тип с общими ключами T, P.
* Если в T и P присутствуют одинаковые атрибуты с разными типами,
* то вернется атрибут с типом P[KEY]. */
export type ExtendDtoAttrs<
  T extends DTO,
  P extends DTO,
> = {
  [KEY in keyof T | keyof P]: KEY extends keyof P
    ? P[KEY]
    : KEY extends keyof T
      ? T[KEY]
      : never;
}

export type DeepPartial<T extends DTO> = {
  [KEY in keyof T]?: T[KEY] extends Record<any, any>
    ? DeepPartial<T[KEY]>
    : Partial<T[KEY]>
}

export type SplitStringToArray<S extends string, D extends string> =
    string extends S ? string[] :
    S extends '' ? string[] :
    S extends `${infer T}${D}${infer U}` ? [T, ...SplitStringToArray<U, D>] : [S];

export type GetArrayType<A extends Array<any>> = A extends Array<infer T> ? T : never;

export type FirstOfArray<A extends Array<any>> = A extends [infer F, ...infer _] ? F : never;

export type LastOfArray<A extends Array<any>> = A extends [...infer _, infer L] ? L : never;

export type ShiftArray<A extends Array<any>> = A extends [infer _, ...infer O] ? O : never;

export type PopArray<A extends Array<any>> = A extends [...infer O, ...infer _] ? O : never;

export type GetDomainAttrsDotKeys<ATTRS extends DTO> =
  GetDtoKeysByDotNotation<ATTRS>
  | GetDtoKeysByDotNotation<ATTRS>[]
  | ReadonlyArray<GetDtoKeysByDotNotation<ATTRS>>

/** Исключить из DTO атрибуты заданные в точечной нотации.
  Пример:
    1. ExcludeDeepAttrs<{a: {b: {c: string, f?: string}}, e: number}, 'a.b.c'>
    2. ExcludeDeepAttrs<{a: {b: {c: string, f?: string}}, e: number}, ['a.b.c', 'e']>
*/
export type ExcludeDeepDtoAttrs<D extends DTO, DOT_NOTATION extends GetDomainAttrsDotKeys<D>> =
  DOT_NOTATION extends Array<any>
    ? ExcludeDeepDotNotationAttrs<D, DOT_NOTATION>
    : DOT_NOTATION extends ReadonlyArray<infer TUPLE_TYPE>
      ? ExcludeDeepDotNotationAttrs<D, UnionToArray<TUPLE_TYPE>>
      : ExcludeDeepDotNotationAttrs<D, UnionToArray<DOT_NOTATION>>

/** Исключить из DTO | DTO[] атрибуты заданные в точечной нотации.
  Пример: ExcludeDeepAttrs<{a: {b: {c: string, f?: string}}, e: number}, ['a.b.c', 'e']>
*/
export type ExcludeDeepDotNotationAttrs<TYPE, DOT_NOTATION extends unknown[]> =
  DOT_NOTATION extends [infer FIRST, ...infer OTHERS]
    ? ExcludeDeepAttrs<TYPE, SplitStringToArray<FIRST & string, '.'>> extends infer DEEPED
      ? OTHERS extends []
        ? DEEPED
        : ExcludeDeepDotNotationAttrs<DEEPED, OTHERS>
      : never
    : ExcludeDeepAttrs<TYPE, [DOT_NOTATION]>

/** Исключить из DTO | DTO[] атрибуты.
  Пример: ExcludeDeepAttrs<{a: {b: {c: string, f?: string}}, e: number}, ['a', 'b', 'c']>
*/
export type ExcludeDeepAttrs<TYPE, ATTRS extends unknown[]> =
  TYPE extends Array<infer ARR_TYPE>
    ? Array<ExcludeDeepAttrs<ARR_TYPE, ATTRS>>
    : TYPE extends DTO
      ? ATTRS extends [infer FIRST, ...infer OTHERS]
        ? FIRST extends keyof TYPE
          ? OTHERS extends []
            ? Omit<TYPE, FIRST>
            : ExcludeDeepAttrs<TYPE[FIRST], OTHERS> extends infer DEEP
              ? DEEP extends string
                ? Omit<TYPE, FIRST> // следующие ключи не валидные
                : Omit<TYPE, FIRST> & Record<FIRST, DEEP>
              : never
          : `${FIRST extends string ? FIRST : 'FIRST'} not key is D`
        : never
      : `${TYPE extends string ? TYPE : 'TYPE'} is literal`
