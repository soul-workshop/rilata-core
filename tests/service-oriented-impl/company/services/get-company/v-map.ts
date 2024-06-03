import { InputDodValidator } from '../../../../../src/api/service/types';
import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { companyAttrsVMap } from '../../domain-data/company/v-map';
import { GetCompanyRequestDod } from './s.params';

const getCompanyVMap: ValidatorMap<GetCompanyRequestDod['attrs']> = {
  id: companyAttrsVMap.id,
};

export const getCompanyValidator: InputDodValidator<GetCompanyRequestDod> =
  new DtoFieldValidator('getCompany', true, { isArray: false }, 'dto', getCompanyVMap);
