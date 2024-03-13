import { ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';
import { AggregateRootDataParams } from '../../../../../src/domain/domain-data/params-types';
import { UserAttrs } from '../../../auth/domain-data/user/params';
import { CompanyAttrs } from '../../../company/domain-data/company/params';
import { PersonOutAttrs } from '../../../subject/domain-data/person/params';

export type FullUser = Pick<UserAttrs, 'userId'> & {
  person: PersonOutAttrs,
}

export type FullCompany = Omit<CompanyAttrs, 'employees'> & {
  employees: FullUser[],
}

export type FullCompanyDomainMeta = DomainMeta<'FullCompany', 'id'>

export type FullCompanyParams = AggregateRootDataParams<
  FullCompany,
  FullCompanyDomainMeta,
  never,
  []
>

export type FullCompanyARDT = ARDT<FullCompany, FullCompanyDomainMeta>
