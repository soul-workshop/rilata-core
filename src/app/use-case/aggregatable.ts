import { AggregateRoot } from '../../domain/domain-object/aggregate-root';
import { AggregateRootParams } from '../../domain/domain-object/types';

export interface Aggregatable {
  getAggregateClass(): AggregateRoot<AggregateRootParams>
}
