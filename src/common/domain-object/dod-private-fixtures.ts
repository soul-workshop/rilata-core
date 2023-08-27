/* eslint-disable no-use-before-define */
import { UUIDType } from '../../common/types';
import { DODUtility } from '../../common/utils/domain-object-data/dod-utility';
import { UUIDUtility } from '../../common/utils/uuid/uuid-utility';
import { domainObjectUtility } from '../utils/domain-object/domain-object-utility';
import { ObjectAttrs, ObjectData, OutputObjectAttrs, OutputObjectData } from './types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DODPrivateFixtures {
  export type PhoneAttrs = {
    number: string,
    type: 'mobile' | 'work',
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

  export type PersonContactsData = {
    attrs: PersonContactsAttrs,
    meta: {
      name: 'PersonContact',
      mutationType: 'read-model-object',
    },
    actions: {
      editPhones: boolean,
      editEmail: boolean,
      editAddress: boolean,
    }
  };

  export const personContactData: PersonContactsData = {
    attrs: personContactAttrs,
    meta: {
      name: 'PersonContact',
      mutationType: 'read-model-object',
    },
    actions: {
      editPhones: true,
      editEmail: true,
      editAddress: true,
    },
  };

  export const outputPersonContactData = domainObjectUtility.getOutputData(
    personContactData,
    ['noOutField', 'email.noOutField', 'phones.noOutField'],
  );
  outputPersonContactData.attrs

  export const personContactsDOD: PersonContactsDOD = DODUtility.getValueObject(
    'PersonContacts',
    personContactsAttrs,
    ['noOutField'],
  );

  export const personContactsOutputDOD = DODUtility.getOutputValueObject<OutputPersonContactsDOD>(
    'PersonContacts',
    personContactsOutputAttrs,
    ['noOutField'],
  );

  export type PersonAttrs = AggregateAttrs<UUIDType, {
    name: string,
    lastName: string,
    birthday: string,
    contacts: PersonContactsDOD,
  }>;

  export type PersonMeta = AggregateMeta<PersonAttrs, 'Person', ['birthday']>;

  export type PersonDOD = AggregateDOD<PersonAttrs, PersonMeta>;

  export type PersonOutputDOD = OutputDomainObjectData<PersonDOD>;

  export const personAttrs: PersonAttrs = {
    id: '1',
    name: 'Nur',
    lastName: 'Ama',
    birthday: '1979-01-17',
    contacts: personContactsDOD,
  };

  export const personOutputAttrs: OutputDODAttrs<PersonDOD> = {
    id: personAttrs.id,
    name: personAttrs.name,
    lastName: personAttrs.lastName,
    contacts: personContactsOutputDOD,
  };

  export const personVersion = 1;

  export const personDOD: PersonDOD = DODUtility
    .getAggregate<PersonDOD>('Person', personAttrs, personVersion, ['birthday']);

  export const personOutputDOD = DODUtility.getOutputAggregate<PersonOutputDOD>(
    'Person',
    personOutputAttrs,
    ['birthday'],
  );

  export type OutputPerson = OutputDomainObjectData<PersonDOD>;

  export type PersonEntityAttrs = PersonAttrs;

  export type PersonEntityMeta = EntityMeta<PersonEntityAttrs, 'PersonEntity', []>;

  export type PersonEntityDOD = EntityDOD<PersonEntityAttrs, PersonEntityMeta>;

  export type OutputPersonEntityDOD = OutputDomainObjectData<PersonEntityDOD>;

  export const personEntityAttrs: PersonEntityAttrs = personAttrs;

  export const personEntityOutputAttrs: OutputDODAttrs<PersonEntityDOD> = {
    id: personEntityAttrs.id,
    name: personEntityAttrs.name,
    lastName: personEntityAttrs.lastName,
    contacts: personContactsOutputDOD,
    birthday: personEntityAttrs.birthday,
  };

  export type PhoneAddedEventAttrs = EventAttrs<PhoneAttrs>;

  export type PhoneAddedEventDOD = EventDOD<PhoneAddedEventAttrs, 'PhoneAddedEvent', PhoneMeta['name'], []>;

  export type PhoneAddedOutputEventDOD = OutputDomainObjectData<PhoneAddedEventDOD>;

  export const phoneAddedEventAttrs: PhoneAddedEventAttrs = {
    ...phoneAttrs,
    eventID: UUIDUtility.getNewUUIDValue(),
  };

  export const phoneAddedEventOutputAttrs: OutputDODAttrs<
    PhoneAddedEventDOD
  > = phoneAddedEventAttrs;

  export type PersonNotFoundErrorAttrs = { personID: number };

  export type PersonNotFoundDomainError = DomainErrorDOD<PersonNotFoundErrorAttrs, 'PersonNotFoundError'>;

  export type PersonNotFoundOutputDomainError = OutputDomainObjectData<PersonNotFoundDomainError>;

  export const personNotFoundAttrs: PersonNotFoundErrorAttrs = {
    personID: 10,
  };

  export const personNotFoundOutputAttrs: OutputDODAttrs<
    PersonNotFoundDomainError
  > = personNotFoundAttrs;

  export type InternalAppErrorAttrs = { traceback: 'any object' };

  export type InternalAppError = AppErrorDOD<InternalAppErrorAttrs, 'InternalError'>;

  export type InternalOutputAppError = OutputDomainObjectData<InternalAppError>;

  export const internalErrorAttrs: InternalAppErrorAttrs = {
    traceback: 'any object',
  };

  export const internalErrorOutputAttrs: OutputDODAttrs<
    InternalAppError
  > = internalErrorAttrs;

  export type ProductAttrs = ReadModelAttrs<{
    name: string,
    price: number,
  }>;

  export type ProductMeta = ReadModelMeta<ProductAttrs, 'Product'>;

  export type ProductDOD = ReadModelDOD<ProductAttrs, ProductMeta>;

  export type OutputProductDOD = OutputDomainObjectData<ProductDOD>;

  export const productAttrs: ProductAttrs = {
    name: 'cheese',
    price: 100,
  };

  export const productOutputAttrs: OutputDODAttrs<ProductDOD> = {
    name: productAttrs.name,
    price: productAttrs.price,
  };

  export const productDOD: ProductDOD = DODUtility.getReadModel('Product', productAttrs);
}
