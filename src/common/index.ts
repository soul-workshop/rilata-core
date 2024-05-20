export type {
  UuidType, IdType, UserId, AttrName, DeepAttr,
  FlatAttrs, Timestamp, Constructor, LiteralType,
  LiteralRecord, LiteralWithUndefined, ConstructorReturnType, LiteralRecordWithUndefined,
} from './types';
export type {
  TupleToUnion, UnionToTuple, TupleToObject, RemoveFirstFromTuple,
  TupleToObjectWithPropNames,
} from './tuple-types';
export type {
  DeepPartial, PopArray, GetDtoKeys, ShiftArray, UnknownDto, ContainsAll,
  LastOfArray, ManyDtoKeys, FirstOfArray, GetArrayType, ExtendDtoAttrs,
  ExcludeDtoAttrs, ReplaceDtoAttrs, ExcludeDeepAttrs, ManyDtoKeysToUnion,
  SplitStringToArray, ExcludeDeepDtoAttrs, GetDomainAttrsDotKeys,
  GetDtoKeysByDotNotation, ExcludeDeepDotNotationAttrs,
} from './type-functions';
export type { Result, GeneralResult } from './result/types';
export type { Logger } from './logger/logger';
export * from './logger/logger-modes';
export * from './exeptions';
export * from './result/success';
export * from './result/failure';
export * from './logger/console-logger';
