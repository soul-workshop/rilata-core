import { Locale } from '../../locale';
import { LeadRule } from './lead-rule';
import { ValidationRule } from './validation-rule';

export type RuleType = 'nullable' |'type' | 'assert' | 'validate';

export type LiteralDataType = string | number | boolean;

export type RuleDataType = LiteralDataType | unknown;

export type GeneralValidationRule = ValidationRule<RuleType, RuleDataType>;

export type GeneralLeadRule = LeadRule<LiteralDataType>;

export type RuleError = Locale

export type RunNextRule = { behaviour: 'RunNextRule' };

export type BreakValidation = { behaviour: 'BreakValidation' };

export type SaveErrorAndBreakValidation = {
  behaviour: 'SaveErrorAndBreakValidation',
  ruleError: RuleError,
};

export type SaveErrorAndRunNextRule = {
  behaviour: 'SaveErrorAndRunNextRule',
  ruleError: RuleError,
};

export type ValidationRuleAnswer =
  RunNextRule
  | BreakValidation
  | SaveErrorAndRunNextRule
  | SaveErrorAndBreakValidation;

export type TypeOrAssertRuleAnswer = RunNextRule | SaveErrorAndBreakValidation;

export type EmptyValueRuleAnswer = RunNextRule | BreakValidation;

export type GetRuleAnswer<RT extends RuleType> =
  RT extends 'type' | 'assert'
    ? TypeOrAssertRuleAnswer
    : RT extends 'nullable'
      ? EmptyValueRuleAnswer
      : ValidationRuleAnswer

export type GetSuccessRuleAnswer<RT extends RuleType> =
  Extract<GetRuleAnswer<RT>, RunNextRule | BreakValidation>;

export type GetFailRuleAnswer<RT extends RuleType> =
  Extract<GetRuleAnswer<RT>, SaveErrorAndRunNextRule | SaveErrorAndBreakValidation>;

type GetBehavourString<RT extends RuleType> =
  GetRuleAnswer<RT> extends ValidationRuleAnswer
    ? GetRuleAnswer<RT>['behaviour']
    : never;

export type GetSuccessBehaviourString<RT extends RuleType> =
  Extract<GetBehavourString<RT>, 'RunNextRule' | 'BreakValidation'>;

export type GetFailBehaviourString<RT extends RuleType> =
  Extract<GetBehavourString<RT>, 'SaveErrorAndBreakValidation' | 'SaveErrorAndRunNextRule'>;
