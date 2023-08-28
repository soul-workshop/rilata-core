import { BaseFieldValidationRule } from '../base.field-v-rule';
import { FieldValidationRuleType } from '../types';

/**
 * Правила, которые всегда проверяются для каждого поля.
 * Однако, будет ли проверяться то или иное правило зависит от переданного FieldValidationConfig.
 * Например, если в конфиг передан тип string,
 * то StringFieldValidationRule запустится, а NumberFieldValidationRule - нет, что логично.
 * Эти правила не указываются клиентами в своих validatorMap. Эти правила
 * задействуются автоматически в базовом коде валидатора.
 */
export abstract class DefaultFieldValidationRule extends BaseFieldValidationRule {
  ruleType: FieldValidationRuleType = 'default';
}
