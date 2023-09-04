/* eslint-disable no-use-before-define */
import { Result } from '../../../common/result/types';
import { DTO } from '../../dto';
import { LiteralDataType, RuleError } from '../../validator/rules/types';
import { DtoFieldValidator } from './dto-field-validator';
import { LiteralFieldValidator } from './literal-field-validator';

export type GetArrayConfig<B extends boolean> = B extends false
  ? {
    isArray: false,
  }
  : {
    isArray: true,
    maxElementsCount?: number,
    minElementsCount?: number,
    mustBeFilled?: boolean, // true -> должна быть хотя бы одна ячейка
  };

type AttrName = string;

export type DtoFieldErrors = { [s: AttrName]: DtoFieldErrors | ArrayFieldErrors | RuleError[]};

type ArrayItemIndex = number;

export type ArrayFieldErrors = Record<ArrayItemIndex, DtoFieldErrors>;

export type FieldValidatorResult = Result<DtoFieldErrors, undefined>;

export type RulesValidatedAnswer<ARR extends boolean = false> = {
    isValidValue: false,
    break: boolean,
    errors: ARR extends true ? ArrayFieldErrors : RuleError[],
  } | {
    isValidValue: true,
    break: boolean,
    errors?: never, // чтобы было проще тестировать
  };

export type GeneralDtoFieldValidator = DtoFieldValidator<boolean, boolean, DTO>;

export type GeneralLiteralFieldValidator = LiteralFieldValidator<
  boolean,
  boolean,
  LiteralDataType
>;

export type GetFieldValidatorDataType<DATA_TYPE extends LiteralDataType | DTO> =
  DATA_TYPE extends DTO
    ? 'dto'
    : DATA_TYPE extends string
      ? 'string'
      : DATA_TYPE extends number
        ? 'number'
        : 'boolean'

type GetValidator<REQ extends boolean, IS_ARR extends boolean, TYPE> =
  TYPE extends DTO
    ? DtoFieldValidator<REQ, IS_ARR, TYPE>
    : TYPE extends LiteralDataType
      ? LiteralFieldValidator<REQ, IS_ARR, TYPE>
      : never

export type ValidatorMap<DTO_TYPE extends DTO> = {
  [KEY in keyof DTO_TYPE]-?: undefined extends DTO_TYPE[KEY]
    ? DTO_TYPE[KEY] extends Array<infer ARR_TYPE>
      ? GetValidator<false, true, ARR_TYPE>
      : GetValidator<false, false, DTO_TYPE[KEY]>
    : DTO_TYPE[KEY] extends Array<infer ARR_TYPE>
      ? GetValidator<true, true, ARR_TYPE>
      : GetValidator<true, false, DTO_TYPE[KEY]>
}
