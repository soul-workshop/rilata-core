import { DomainMeta, GeneralEventDod, IdDomainAttrs } from '../domain-object-data/types';
import { AggregateRoot } from './aggregate-root';

export type AggregateRootParams = {
  attrs: IdDomainAttrs,
  meta: DomainMeta,
  events: GeneralEventDod[],
}

export type GeneralAggregateRoot = AggregateRoot<AggregateRootParams>;
