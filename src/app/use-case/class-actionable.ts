import { Actions } from '../../domain/domain-object-data/types';

export interface ClassActionable {
  getClassActions(): Promise<Actions>
}
