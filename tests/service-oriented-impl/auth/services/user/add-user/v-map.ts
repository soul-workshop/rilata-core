import { InputDodValidator } from '../../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { userAttrsVmap } from '../../../domain-data/user/v-map';
import { AddUserRequestDod, AddUserRequestDodAttrs } from './s-params';

const addUserVmap: ValidatorMap<AddUserRequestDodAttrs> = {
  personIin: userAttrsVmap.personIin,
};

export const addUserValidator: InputDodValidator<AddUserRequestDod> =
  new DtoFieldValidator('addUser', true, { isArray: false }, 'dto', addUserVmap);
