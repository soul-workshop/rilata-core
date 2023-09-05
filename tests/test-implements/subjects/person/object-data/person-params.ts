import { AggregateRootParams } from '../../../../../src/domain/domain-object/types';

export type PersonAttrs = {
  id: string, // govPersonId
  name: string,
  lastName: string,
  patronomic?: string,
}

export type PersonMeta = {
  name: 'PersonAR',
}

export type PersonEvents = [];

export type PersonParams = AggregateRootParams<PersonAttrs, PersonMeta, PersonEvents>;
