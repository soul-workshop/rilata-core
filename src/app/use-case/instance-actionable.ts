import { Actions, IdDomainAttrs } from '../../domain/domain-object-data/types';

export interface InstanceActionable {
  getInstanceActions(instance: IdDomainAttrs): Promise<Actions>
}
