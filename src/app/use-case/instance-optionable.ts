import { Actions } from '../../domain/domain-object-data/types';
import { GeneralAggregateRoot } from '../../domain/domain-object/types';

export interface InstanceOptionable {
  getInstanceActions(aggregate: GeneralAggregateRoot): Actions
}
