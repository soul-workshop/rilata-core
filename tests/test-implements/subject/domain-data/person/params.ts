import { AggregateRootDataParams } from '../../../../../src/domain/domain-object-data/aggregate-data-types';
import { DomainMeta } from '../../../../../src/domain/domain-object-data/common-types';
import { AddPersonActionParams } from './add-person.a-params';
import { AddPhoneActionParams } from './add-phones.a-params';

export type PhoneAttrs = {
  number: string,
  type: string, // 'mobile' | 'work' | 'home'
}

export type EmailAttrs = {
  email: string,
  type: string, // 'corporate' | 'private'
}

export type ContactsAttrs = {
  phones: PhoneAttrs[],
  email?: EmailAttrs[],
  address?: string,
}

export type PersonAttrs = {
  id: string,
  govPersonId: string,
  name: string,
  lastName: string,
  patronomic?: string,
  contacts: ContactsAttrs,
}

export type PersonMeta = DomainMeta<'PersonAR'>;

export type PersonParams = AggregateRootDataParams<
  PersonAttrs, PersonMeta, AddPersonActionParams | AddPhoneActionParams
>;
