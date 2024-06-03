import { uuidUtility } from '../../../../../core/utils/uuid/uuid-utility';
import { ValidationRuleAnswer } from '../../types';
import { ValidationRule } from '../../validation-rule';

export class UUIDFormatValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Значение должно соответствовать формату UUID';

  validate(value: string): ValidationRuleAnswer {
    return uuidUtility.isValidValue(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
