import { DomainMeta, GeneralEventDod, IdDomainAttrs } from '../domain-object-data/types';
import { AggregateRoot } from './aggregate-root';

export type AggregateRootParams<
  ATTRS extends IdDomainAttrs,
  META extends DomainMeta,
  EVENTS extends GeneralEventDod[]
> = {
  attrs: ATTRS,
  meta: META,
  events: EVENTS,
}

export type GeneralAggregateRootParams = AggregateRootParams<
  IdDomainAttrs, DomainMeta, GeneralEventDod[]
>;

export type GeneralAggregateRoot = AggregateRoot<GeneralAggregateRootParams>;
