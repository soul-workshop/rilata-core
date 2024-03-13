import { RequestDodValidator } from '../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { companyAttrsVMap } from '../../domain-data/company/v-map';
import { GetCompanyRequestDod, GetCompanyServiceParams } from './s.params';

const getCompanyVMap: ValidatorMap<GetCompanyRequestDod['attrs']> = {
  id: companyAttrsVMap.id,
};

export const getCompanyValidator: RequestDodValidator<GetCompanyServiceParams> =
  new DtoFieldValidator('getCompany', true, { isArray: false }, 'dto', getCompanyVMap);
