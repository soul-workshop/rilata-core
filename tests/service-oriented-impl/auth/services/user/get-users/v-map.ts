import { RequestDodValidator } from '../../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../../../src/domain/validator/field-validator/literal-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { UUIDFormatValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { GetUsersRequestDodAttrs, GetUsersServiceParams } from './s-params';

const getUsersVMap: ValidatorMap<GetUsersRequestDodAttrs> = {
  userIds: new LiteralFieldValidator('userIds', true, { isArray: true }, 'string', [
    new UUIDFormatValidationRule(),
  ]),
};

export const getUsersValidator: RequestDodValidator<GetUsersServiceParams> =
  new DtoFieldValidator('getUsers', true, { isArray: false }, 'dto', getUsersVMap);
