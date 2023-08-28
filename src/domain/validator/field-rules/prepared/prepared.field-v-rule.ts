import { BaseFieldValidationRule } from '../base.field-v-rule';
import { FieldValidationRuleType } from '../types';

/**
 * Заранее заготовленные правила, которые клиенты могут указывать в конфиге валидации
 * в параметре дополнительных правила.
 * Заранее заготовленные правила позволяют устранить дублирование.
 */
export abstract class PreparedFieldValidationRule extends BaseFieldValidationRule {
  ruleType: FieldValidationRuleType = 'prepared';
}
