/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { success } from '../../../common/result/success';
import { LeadRule } from '../../validator/rules/lead-rule';
import { LiteralDataType } from '../../validator/rules/types';
import { ValidationRule } from '../../validator/rules/validation-rule';
import { FieldValidator } from './field-validator';
import { GetArrayConfig, GetFieldValidatorDataType, FieldValidatorResult } from './types';

export class LiteralFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DATA_TYPE extends LiteralDataType
> extends FieldValidator<NAME, REQ, IS_ARR, DATA_TYPE> {
  constructor(
    attrName: NAME,
    protected dataType: GetFieldValidatorDataType<DATA_TYPE>,
    isRequired: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    protected validateRules: ValidationRule<'validate', DATA_TYPE>[],
    protected leadRules: LeadRule<DATA_TYPE>[] = [],
  ) {
    super(attrName, dataType, isRequired, arrayConfig);
  }

  /** предварительная проверка на типы данных и нулевые значения или утверждения
    1. В начале проверяется проверка нулевых значений, (undefined, null).
      Эти проверки выполняются правилами возвращаемыми с метода getNullableRules().
        a. nullable-rule могут завершить поток проверки с валидным ответом.
        b. assert-rule завершают поток проверки с ошибкой.
    2. Проверка типа. Провал проверки также завершает процесс проверки.
    3. Приведение значения не могут вызвать ошибку, но могут изменить значение value.
    4. Наконец проверка валидации (переданных в конструкторе). Провал проверки
      обычно не завершает процесс проверок, а идет накопление ошибок.
  */
  protected validateValue(value: unknown): FieldValidatorResult {
    const preValidateAnswer = this.validateOnNullableAntType(value);
    if (preValidateAnswer.break) {
      return preValidateAnswer.isValidValue
        ? success(undefined)
        : this.getFailResult(preValidateAnswer.errors);
    }

    const leadedValue = this.leadRules.reduce(
      (newValue, leadRule) => leadRule.lead(newValue as DATA_TYPE),
      value,
    );
    const validateAnswer = this.validateByRules(leadedValue, this.validateRules);
    return validateAnswer.isValidValue
      ? success(undefined)
      : this.getFailResult(validateAnswer.errors);
  }
}
