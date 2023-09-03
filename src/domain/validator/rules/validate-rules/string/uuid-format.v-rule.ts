import { UUIDUtility } from '../../../../../common/utils/uuid/uuid-utility';
import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class UUIDFormatValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Значение должно соответствовать формату UUID';

  validate(value: string): ValidationRuleAnswer {
    return UUIDUtility.isValidValue(value)
      ? this.returnSuccess('RunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
