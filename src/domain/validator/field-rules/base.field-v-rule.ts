import { FieldValidationRuleResult, FieldValidationRuleType } from './types';

export abstract class BaseFieldValidationRule {
  abstract ruleType: FieldValidationRuleType;

  /**
   * Должно содержать очень краткое уникальное пояснение какое правило
   * нарушило валидируемое этим правилом значение в утвердительной форме.
   * Например, для превышения длины строки (MaxCharsFieldValidationRule),
   * поле может иметь значение 'CharsMustBeLessCount'
   */
  abstract ruleExplanation: string;

  abstract validate(value: unknown): FieldValidationRuleResult;
}
