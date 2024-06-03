import { InputDodValidator } from '../../../../../../src/api/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../../../src/domain/validator/field-validator/literal-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { UUIDFormatValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { GetUsersRequestDod, GetUsersRequestDodAttrs } from './s-params';

const getUsersVMap: ValidatorMap<GetUsersRequestDodAttrs> = {
  userIds: new LiteralFieldValidator('userIds', true, { isArray: true }, 'string', [
    new UUIDFormatValidationRule(),
  ]),
};

export const getUsersValidator: InputDodValidator<GetUsersRequestDod> =
  new DtoFieldValidator('getUsers', true, { isArray: false }, 'dto', getUsersVMap);
