import { FieldValidationRuleResult } from '../types';
import { PreparedFieldValidationRule } from './prepared.field-v-rule';

export const choiceRuleExplanation = 'ValueMustBeFromChoices';

export class ChoiceFieldRule extends PreparedFieldValidationRule {
  ruleExplanation = choiceRuleExplanation;

  private choices: unknown[];

  constructor(choices: unknown[]) {
    super();
    this.choices = choices;
  }

  validate(value: unknown): FieldValidationRuleResult {
    return this.choices.includes(value)
      ? {
        behaviour: 'RunNextRule',
      }
      : {
        behaviour: 'SaveErrorAndRunNextRule',
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { choices: JSON.stringify(this.choices) },
          ],
        },
      };
  }
}
