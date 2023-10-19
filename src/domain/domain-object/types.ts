import { GeneralARDParams } from '../domain-object-data/aggregate-data-types';
import { AggregateRoot } from './aggregate-root';

export type GeneralAR = AggregateRoot<GeneralARDParams>;

export type GetARParams<AR extends GeneralAR> =
  AR extends AggregateRoot<infer T> ? T : never;
