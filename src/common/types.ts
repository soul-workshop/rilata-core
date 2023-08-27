/* eslint-disable @typescript-eslint/no-explicit-any */

import { DTO } from './dto';

export type LiteralType = string | number | boolean | bigint;
export type LiteralWithUndefined = LiteralType | undefined;

export type LiteralRecord = Record<string, LiteralType>;
export type LiteralRecordWithUndefined = Record<string, LiteralWithUndefined>;

/** Плоский объект, без вложенного объекта */
export type FlatAttrs = Record<
  string,
  LiteralType | LiteralType[]
>;

export type FlatAttrsWithUndefined = Record<
  string,
  LiteralWithUndefined | LiteralWithUndefined[]
>;

export type NestedAttrs = Record<
  string,
  LiteralType | LiteralType[] | DTO | DTO[]
>;

export type NestedAttrsWithUndefined = Record<
  string,
  LiteralWithUndefined | LiteralWithUndefined[] | DTO | DTO[]
>;

export type AttrName = string;

export type IDType = string;
export type UUIDType = string;

/** Имя атрибута через точечную нотацию */
export type DeepAttr = string;

export type Constructor<T> = new (...args: any[]) => T;

export type ConstructorReturnType<C extends Constructor<any>>
= C extends Constructor<infer R> ? R : never;

export type Timestamp = number;
export type UserID = UUIDType;
