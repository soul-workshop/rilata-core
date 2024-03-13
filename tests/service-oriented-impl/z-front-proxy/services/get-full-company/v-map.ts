import { RequestDodValidator } from '../../../../../src/app/service/types';
import { DtoFieldValidator } from '../../../../../src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from '../../../../../src/domain/validator/field-validator/types';
import { companyAttrsVMap } from '../../../company/domain-data/company/v-map';
import { GetFullCompanyRequestDodAttrs, GetFullCompanyServiceParams } from './s-params';

const getFullCompanyVmap: ValidatorMap<GetFullCompanyRequestDodAttrs> = {
  id: companyAttrsVMap.id,
};

export const getFullCompanyValidator: RequestDodValidator<GetFullCompanyServiceParams> =
  new DtoFieldValidator('GetFullCompanyRequestDod', true, { isArray: false }, 'dto', getFullCompanyVmap);
