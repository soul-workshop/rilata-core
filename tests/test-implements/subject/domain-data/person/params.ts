import { AggregateRootDataParams } from '../../../../../src/domain/domain-object-data/params-types';
import { DomainMeta } from '../../../../../src/domain/domain-object-data/domain-types';
import { AddPersonActionParams } from './add-person.params';
import { AddPhoneActionParams } from './add-phones.params';

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
  techSupportComments?: string[],
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

// при вызове у агрегата personAR.getHelper().getOutput() вернется объект без комментов техподдержки
export type PersonParams = AggregateRootDataParams<
  PersonAttrs, PersonMeta, AddPersonActionParams | AddPhoneActionParams, ['contacts.techSupportComments']
>;

export type OutputPersonAttrs = PersonAttrs;
