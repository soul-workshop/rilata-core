import { ValidationRuleAnswer } from '../types';
import { PreparedValidationRule } from './prepared.field-v-rule';

export const choiceRuleExplanation = 'ValueMustBeFromChoices';

export class ChoiceValidationRule extends PreparedValidationRule {
  ruleExplanation = choiceRuleExplanation;

  private choices: unknown[];

  constructor(choices: unknown[]) {
    super();
    this.choices = choices;
  }

  validate(value: unknown): ValidationRuleAnswer {
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
