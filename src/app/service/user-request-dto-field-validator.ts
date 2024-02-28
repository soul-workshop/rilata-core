import { DTO } from '../../domain/dto';
import { DtoFieldValidator } from '../../domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../domain/validator/field-validator/literal-field-validator';
import { FullFieldResult } from '../../domain/validator/field-validator/types';
import { success } from '../../common/result/success';
import { UUIDFormatValidationRule } from '../../domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { failure } from '../../common/result/failure';

const userRequestDTOValidatorMap = {
  userId: new LiteralFieldValidator('userId', false, { isArray: false }, 'string', [new UUIDFormatValidationRule()]),
  onMe: new LiteralFieldValidator('onMe', false, { isArray: false }, 'boolean', []),
};

class UserRequestDtoFieldValidator extends DtoFieldValidator<
'getUser',
true,
false,
{ userId?: string, onMe?: boolean}
> {
  constructor() {
    super('getUser', true, { isArray: false }, 'dto', userRequestDTOValidatorMap);
  }

  protected complexValidate(value: DTO): FullFieldResult {
    if (Boolean(value.userId) !== Boolean(value.onMe)) {
      return success(undefined);
    }
    return failure({
      ___dto_whole_value_validation_error___: [
        {
          text: 'DTO должен содержать либо userId, либо onMe',
          name: 'InvalidFieldCombinationError',
          hint: {},
        },
      ],
    });
  }
}

export const userRequestDtoFieldValidatorInstance = new UserRequestDtoFieldValidator();
