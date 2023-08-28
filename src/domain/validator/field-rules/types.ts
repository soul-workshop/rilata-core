import { FieldValidationError } from '../types';

export type FieldValidationRuleType = 'default' | 'prepared' | 'custom';

export enum FieldValidationRuleResultBehaviour {
  RunNextRule = 'RunNextRule',
  BreakFieldValidation = 'BreakFieldValidation',
  SaveErrorAndRunNextRule = 'SaveErrorAndRunNextRule',
  SaveErrorAndBreakFieldValidation = 'SaveErrorAndBreakFieldValidation'
}

export type FieldValidationRuleResult = {
  behaviour: FieldValidationRuleResultBehaviour.RunNextRule,
} | {
  behaviour: FieldValidationRuleResultBehaviour.BreakFieldValidation,
} | {
  behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndRunNextRule,
  fieldValidationError: FieldValidationError,
} | {
  behaviour: FieldValidationRuleResultBehaviour.SaveErrorAndBreakFieldValidation,
  fieldValidationError: FieldValidationError,
}
