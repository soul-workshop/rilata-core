/* eslint-disable no-use-before-define */
import { Result } from '../../../common/result/types';
import { GeneralCommandDod } from '../../domain-object-data/common-types';
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

type ArrayItemIndex = number;

export type RuleErrors = RuleError[];

export type LiteralFieldValidatorErrors = { [s: AttrName]: RuleErrors };

export type ArrayLiteralFieldValidatorErrors = {
  [i: ArrayItemIndex]: LiteralFieldValidatorErrors | RuleErrors;
};

export type DtoFieldValidatorErrors = {
 [s: AttrName]: DtoFieldValidatorErrors | LiteralFieldValidatorErrors;
};

export type ArrayDtoFieldValidatorErrors = {
 [s: ArrayItemIndex]: DtoFieldValidatorErrors | RuleErrors;
};

export type FieldValidatorErrors =
  LiteralFieldValidatorErrors
  | DtoFieldValidatorErrors

export type FieldValidatorResult = Result<FieldValidatorErrors, undefined>;

export type ArrayFieldValidatorErrors =
  ArrayLiteralFieldValidatorErrors
  | ArrayDtoFieldValidatorErrors;

export type ArrayFieldValidatorResult = Result<ArrayFieldValidatorErrors, undefined>;

export type FullFieldValidatorResult =
  Result<FieldValidatorErrors | ArrayFieldValidatorErrors, undefined>;

export type RulesValidatedAnswer = {
    isValidValue: false,
    break: boolean,
    errors: RuleErrors,
  } | {
    isValidValue: true,
    break: boolean,
    errors?: never, // чтобы было проще тестировать
  };

export type GeneralDtoFieldValidator = DtoFieldValidator<string, boolean, boolean, DTO>;

export type GeneralLiteralFieldValidator = LiteralFieldValidator<
  string,
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

type GetValidator<NAME extends string, REQ extends boolean, IS_ARR extends boolean, TYPE> =
    TYPE extends DTO
      ? DtoFieldValidator<NAME, REQ, IS_ARR, TYPE>
      : TYPE extends LiteralDataType
        ? LiteralFieldValidator<NAME, REQ, IS_ARR, TYPE>
        : never

export type ValidatorMap<DTO_TYPE extends DTO> = {
  [KEY in keyof DTO_TYPE & string]-?: unknown extends DTO_TYPE[KEY]
    ? LiteralFieldValidator<KEY, boolean, boolean, unknown>
    : undefined extends DTO_TYPE[KEY]
      ? NonNullable<DTO_TYPE[KEY]> extends Array<infer ARR_TYPE>
        ? GetValidator<KEY, false, true, NonNullable<ARR_TYPE>>
        : GetValidator<KEY, false, false, NonNullable<DTO_TYPE[KEY]>>
      : NonNullable<DTO_TYPE[KEY]> extends Array<infer ARR_TYPE>
        ? GetValidator<KEY, true, true, NonNullable<ARR_TYPE>>
        : GetValidator<KEY, true, false, NonNullable<DTO_TYPE[KEY]>>
}

export type CommandValidatorMap<CMD extends GeneralCommandDod> =
  DtoFieldValidator<CMD['name'], true, false, CMD['attrs']>;
