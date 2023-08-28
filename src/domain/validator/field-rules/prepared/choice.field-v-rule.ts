import { FieldValidationRuleResult, FieldValidationRuleResultBehaviour } from '../types';
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
    return !this.choices.includes(value)
      ? {
        behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndRunNextRule,
        fieldValidationError: {
          validationErrorName: this.ruleExplanation,
          validationErrorHint: [
            { choices: JSON.stringify(this.choices) },
          ],
        },
      }
      : {
        behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
      };
  }
}
