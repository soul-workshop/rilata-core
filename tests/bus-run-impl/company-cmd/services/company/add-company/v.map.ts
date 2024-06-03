import { InputDodValidator } from '../../../../../../src/api/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { companyAttrsVMap } from '../../../domain-data/company/v-map';
import { AddCompanyRequestDod, AddCompanyRequestDodAttrs } from './s.params';

const addCompanyVmap: ValidatorMap<AddCompanyRequestDodAttrs> = {
  name: companyAttrsVMap.name,
  bin: companyAttrsVMap.bin,
  address: companyAttrsVMap.address,
};

export const addCompanyValidator: InputDodValidator<AddCompanyRequestDod> =
  new DtoFieldValidator('addCompany', true, { isArray: false }, 'dto', addCompanyVmap);
