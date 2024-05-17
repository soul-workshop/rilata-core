import { AggregateRootParams, ARDT, DomainMeta } from '../../../../../src/domain/domain-data/domain-types';
import { UserAttrs } from '../../../auth/domain-data/user/params';
import { CompanyAttrs } from '../../../company/domain-data/company/params';
import { PersonAttrs } from '../../../subject/domain-data/person/params';

export type FullUser = Pick<UserAttrs, 'userId'> & {
  person: PersonAttrs,
}

export type FullCompany = Omit<CompanyAttrs, 'employees'> & {
  employees: FullUser[],
}

export type FullCompanyDomainMeta = DomainMeta<'FullCompany', 'id'>

export type FullCompanyParams = AggregateRootParams<
  FullCompany,
  FullCompanyDomainMeta,
  never,
  []
>

export type FullCompanyARDT = ARDT<FullCompany, FullCompanyDomainMeta, []>
