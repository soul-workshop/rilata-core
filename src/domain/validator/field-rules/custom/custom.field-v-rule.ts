import { BaseFieldValidationRule } from '../base.field-v-rule';
import { FieldValidationRuleType } from '../types';

/**
 * Пользовательские кастомные правила валидации должны наследоваться от этого класса.
 */
export abstract class CustomFieldValidationRule extends BaseFieldValidationRule {
  ruleType: FieldValidationRuleType = 'custom';
}
