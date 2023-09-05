import { Logger } from '../../../common/logger/logger';
import { failure } from '../../../common/result/failure';
import { success } from '../../../common/result/success';
import { AssertionException } from '../../../common/types';
import { DTO } from '../../dto';
import { CannotBeEmptyArrayAssertionRule } from '../../validator/rules/assert-rules/cannot-be-empty-array.a-rule';
import { CannotBeNullableAssertionRule } from '../../validator/rules/assert-rules/cannot-be-nullable.a-rule';
import { MaxArrayElementsCountAssertionRule } from '../../validator/rules/assert-rules/max-array-elements-count.a-rule';
import { MinArrayElementsCountAssertionRule } from '../../validator/rules/assert-rules/min-array-elements-count.a-rule';
import { CanBeNullableRule } from '../../validator/rules/nullable-rules/can-be-nullable.n-rule';
import { IsArrayTypeRule } from '../../validator/rules/type-rules/is-array-type.t-rule';
import { IsBooleanTypeRule } from '../../validator/rules/type-rules/is-boolean-type.t-rule';
import { IsDTOTypeRule } from '../../validator/rules/type-rules/is-dto-type.t-rule';
import { IsNumberTypeRule } from '../../validator/rules/type-rules/is-number-type.t-rule';
import { IsStringTypeRule } from '../../validator/rules/type-rules/is-string-type.t-rule';
import { GeneralValidationRule, LiteralDataType, RuleError } from '../../validator/rules/types';
import { ValidationRule } from '../../validator/rules/validation-rule';
import { CannotBeEmptyStringAssertionRule } from '../rules/assert-rules/cannot-be-empty-string.v-rule';
import {
  FieldValidatorResult, GetArrayConfig, GetFieldValidatorDataType,
  ArrayFieldErrors, RulesValidatedAnswer,
} from './types';

export abstract class FieldValidator<
  REQ extends boolean, IS_ARR extends boolean, DATA_TYPE extends LiteralDataType | DTO
> {
  static WHOLE_VALUE_VALIDATION_ERROR_KEY = '___whole_value_validation_error___';

  protected attrName!: string;

  protected logger!: Logger;

  protected abstract validateValue(value: unknown): FieldValidatorResult

  protected nullableRules: ValidationRule<'nullable' | 'assert', DATA_TYPE>[];

  protected typeCheckRules: ValidationRule<'type', DATA_TYPE>[];

  protected arrayAssertionRules: ValidationRule<'assert', DATA_TYPE>[];

  constructor(
    protected dataType: GetFieldValidatorDataType<DATA_TYPE>,
    protected isRequired: REQ,
    protected arrayConfig: GetArrayConfig<IS_ARR>,
  ) {
    if (arrayConfig.isArray) {
      const [min, max] = [arrayConfig.minElementsCount, arrayConfig.maxElementsCount];
      if (
        (min !== undefined && min < 0)
        || (max !== undefined && max < 0)
        || (
          min !== undefined && max !== undefined && min > max
        )
      ) throw new AssertionException(`not valid arrayConfig: min=${min}, max=${max}`);
    }

    this.nullableRules = this.getNullableRules();
    this.typeCheckRules = this.getTypeCheckRules();
    this.arrayAssertionRules = this.arrayConfig.isArray ? this.getArrayAssertionRules() : [];
  }

  init(attrName: string, logger: Logger): void {
    this.attrName = attrName;
    this.logger = logger;
    [this.nullableRules, this.typeCheckRules, this.arrayAssertionRules].forEach(
      (rules) => rules.forEach((rule) => rule.init(logger)),
    );
  }

  validate(value: unknown): FieldValidatorResult {
    return this.arrayConfig.isArray
      ? this.validateArray(value)
      : this.validateValue(value);
  }

  /** проверка массива данных */
  protected validateArray(unknownValue: unknown): FieldValidatorResult {
    function unknownValueToArray(): unknown[] {
      if (Array.isArray(unknownValue)) return unknownValue;
      throw new AssertionException('array assertion rules not missed a mistake');
    }

    const arrayAssertAnswer = this.validateByRules(unknownValue, this.getArrayAssertionRules());
    if (arrayAssertAnswer.isValidValue === false) {
      return this.getFailResult(arrayAssertAnswer.errors);
    }

    const values = unknownValueToArray();
    const arrErrors: ArrayFieldErrors = {};
    for (let i = 0; i < values.length; i += 1) {
      const itemResult = this.validateValue(values[i]);
      if (itemResult.isFailure()) {
        arrErrors[i] = itemResult.value;
      }
    }

    return Object.keys(arrErrors).length > 0
      ? this.getFailResult(arrErrors)
      : success(undefined);
  }

  /** предварительные проверки на нулевое значение, тип данных */
  protected validateOnNullableAntType(
    value: unknown,
  ): RulesValidatedAnswer {
    let errors: RuleError[] = [];
    let lastAnswer: RulesValidatedAnswer;

    function getAnswer(): RulesValidatedAnswer {
      return errors.length > 0
        ? { isValidValue: false, break: lastAnswer.break, errors }
        : { isValidValue: true, break: lastAnswer.break };
    }

    lastAnswer = this.validateByRules(value, this.getNullableRules());
    if (!lastAnswer.isValidValue) errors = [...errors, ...lastAnswer.errors];
    if (lastAnswer.break) return getAnswer();

    lastAnswer = this.validateByRules(value, this.getTypeCheckRules());
    if (!lastAnswer.isValidValue) errors = [...errors, ...lastAnswer.errors];
    return getAnswer();
  }

  protected getFailResult(errors: RuleError[] | ArrayFieldErrors): FieldValidatorResult {
    return failure({ [this.attrName]: errors });
  }

  protected getNullableRules(): ValidationRule<'nullable', unknown>[] | ValidationRule<'assert', unknown>[] {
    return this.isRequired
      ? [new CannotBeNullableAssertionRule(), new CannotBeEmptyStringAssertionRule()]
      : [new CanBeNullableRule()];
  }

  protected getTypeCheckRules(): ValidationRule<'type', unknown>[] {
    if (this.dataType === 'dto') return [new IsDTOTypeRule()];
    if (this.dataType === 'number') return [new IsNumberTypeRule()];
    if (this.dataType === 'boolean') return [new IsBooleanTypeRule()];
    return [new IsStringTypeRule()];
  }

  /** возвращает правила проверки типов и утверждений для массива */
  protected getArrayAssertionRules(): ValidationRule<'assert', unknown>[] {
    if (!this.arrayConfig.isArray) throw new AssertionException('wrong call this method');
    const assertionRules = [new IsArrayTypeRule()];
    if (this.arrayConfig.mustBeFilled) assertionRules.push(new CannotBeEmptyArrayAssertionRule());
    if (this.arrayConfig.maxElementsCount !== undefined) {
      assertionRules.push(new MaxArrayElementsCountAssertionRule(
        this.arrayConfig.maxElementsCount,
      ));
    }
    if (this.arrayConfig.minElementsCount !== undefined) {
      assertionRules.push(new MinArrayElementsCountAssertionRule(
        this.arrayConfig.minElementsCount,
      ));
    }
    return assertionRules;
  }

  /** проверяет значение на соответствие правил */
  protected validateByRules(
    value: unknown,
    rules: GeneralValidationRule[],
  ): RulesValidatedAnswer {
    const errors: RuleError[] = [];
    let shouldBreak = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const rule of rules) {
      const result = rule.validate(value);
      const { behaviour } = result;

      if (behaviour === 'BreakValidation') {
        shouldBreak = true;
      } else if (behaviour === 'SaveErrorAndRunNextRule') {
        errors.push(result.ruleError);
      } else if (behaviour === 'SaveErrorAndBreakValidation') {
        errors.push(result.ruleError);
        shouldBreak = true;
      }
      if (shouldBreak) break;
    }

    return errors.length > 0
      ? { isValidValue: false, errors, break: shouldBreak }
      : { isValidValue: true, break: shouldBreak };
  }
}
