import { AggregateRootDataParams } from '../../../../../src/domain/domain-data/params-types';
import { DomainMeta, OutputAggregateDataTransfer } from '../../../../../src/domain/domain-data/domain-types';
import { AddPersonActionParams } from './add-person/a-params';
import { AddPhoneActionParams } from './add-phones/add-phones.params';
import { ExcludeDeepDtoAttrs } from '../../../../../src/common/type-functions';

export type PhoneTypes = 'mobile' | 'work' | 'home';

export type PhoneAttrs = {
  number: string,
  type: PhoneTypes,
}

export type EmailTypes = 'corporate' | 'private';

export type EmailAttrs = {
  email: string,
  type: EmailTypes,
}

export type ContactsAttrs = {
  phones?: PhoneAttrs[],
  emails?: EmailAttrs[],
  address?: string,
  techSupportComments?: string[],
}

export type PersonAttrs = {
  id: string,
  iin: string,
  firstName: string,
  lastName: string,
  contacts: ContactsAttrs,
}

export type PersonMeta = DomainMeta<'PersonAR'>;

// при вызове у агрегата personAR.getHelper().getOutput() вернется объект без комментов техподдержки
export type PersonParams = AggregateRootDataParams<
  PersonAttrs, PersonMeta, AddPersonActionParams | AddPhoneActionParams, ['contacts.techSupportComments']
>;

export type PersonOutAttrs = ExcludeDeepDtoAttrs<PersonAttrs, PersonParams['noOutKeys']>

export type PersonARDT = OutputAggregateDataTransfer<PersonParams>
