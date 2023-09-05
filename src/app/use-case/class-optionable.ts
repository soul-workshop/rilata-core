import { Actions } from '../../domain/domain-object-data/types';
import { AggregateRoot } from '../../domain/domain-object/aggregate-root';

export interface ClassOptionable {
  getOptions(aggregate: typeof AggregateRoot): Actions
}
