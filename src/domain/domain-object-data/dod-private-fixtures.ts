/* eslint-disable no-use-before-define */
import { domainObjectUtility } from '../../common/utils/domain-object/domain-object-utility';
import { ErrorDod, EventDod } from './types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DODPrivateFixtures {
  export type PhoneAttrs = {
    number: string,
    type: string, // 'mobile' | 'work'
    noOutField: string,
  };

  export const phoneAttrs: PhoneAttrs = {
    number: '+7-777-287-81-82',
    type: 'mobile',
    noOutField: 'empty info',
  };

  export type EmailAttrs = {
    value: string,
    noOutField: string,
  };

  export const emailAttrs: EmailAttrs = {
    value: 'email@example.com',
    noOutField: 'empty info',
  };

  export type PersonContactsAttrs = {
    phones: PhoneAttrs[],
    email: EmailAttrs,
    address: string,
    noOutField: string,
  };

  export const personContactAttrs: PersonContactsAttrs = {
    phones: [phoneAttrs],
    email: emailAttrs,
    address: 'Kazakhstan, Uralsk, 27 Kurmangazy street',
    noOutField: 'he-he-he',
  };

  export type PersonAttrs = {
    id: string,
    name: string,
    lastName: string,
    birthday: number,
    age: number,
    contacts: PersonContactsAttrs,
  };

  export const personAttrs: PersonAttrs = {
    id: '1',
    name: 'Nur',
    lastName: 'Ama',
    birthday: new Date('1979-01-17').getTime(),
    age: 42,
    contacts: personContactAttrs,
  };

  export type PersonDOD = {
    attrs: PersonAttrs,
    meta: {
      name: 'Person',
      mutationType: 'read-model-object',
    },
    actions: {
      editPersonData: boolean,
      editPhones: boolean,
      editEmail: boolean,
      editAddress: boolean,
    }
  }

  export const personDOD: PersonDOD = {
    attrs: personAttrs,
    meta: {
      name: 'Person',
      mutationType: 'read-model-object',
    },
    actions: {
      editPersonData: true,
      editEmail: true,
      editPhones: true,
      editAddress: true,
    },
  };

  export const outputPersonDOD = domainObjectUtility.getOutputData(
    personDOD,
    ['contacts.noOutField', 'contacts.email.noOutField', 'contacts.phones.noOutField'],
  );

  export type PersonNotExitsErrorDOD = ErrorDod<{ personId: string }, 'PersonNotExistError'>;

  export type PersonEmailAddedEventDOD = EventDod<PersonAttrs, 'PersonEmailAddedEvent'>;
}
