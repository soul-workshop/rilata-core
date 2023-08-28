import { FieldValidationError } from '../types';

export type FieldValidationRuleType = 'default' | 'prepared' | 'custom';

export type FieldValidationRuleResult = {
  behaviour: 'RunNextRule'
    | 'BreakFieldValidation',
} | {
  behaviour: 'SaveErrorAndRunNextRule'
    | 'SaveErrorAndBreakFieldValidation',
  fieldValidationError: FieldValidationError,
}
