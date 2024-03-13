import { RequestDodValidator } from '../../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../../src/domain/validator/field-validator/types';
import { companyAttrsVMap } from '../../../domain-data/company/v-map';
import { AddCompanyRequestDodAttrs, AddCompanyServiceParams } from './s.params';

const addCompanyVmap: ValidatorMap<AddCompanyRequestDodAttrs> = {
  name: companyAttrsVMap.name,
  bin: companyAttrsVMap.bin,
  address: companyAttrsVMap.address,
};

export const addCompanyValidator: RequestDodValidator<AddCompanyServiceParams> =
  new DtoFieldValidator('addCompany', true, { isArray: false }, 'dto', addCompanyVmap);
