import { DomainMeta, GeneralEventDOD, IdDomainAttrs } from '../domain-object-data/types';
import { AggregateRoot } from './aggregate-root';

export type AggregateRootParams = {
  attrs: IdDomainAttrs,
  meta: DomainMeta,
  events: GeneralEventDOD[],
}

export type GeneralAggregateRoot = AggregateRoot<AggregateRootParams>;
