import { Actions } from '../../domain/domain-object-data/types';
import { Aggregatable } from './aggregatable';
import { ClassActionable } from './class-actionable';

export class ClassActions implements ClassActionable {
  constructor(public useCase: Aggregatable) {}

  getClassActions(): Promise<Actions> {
    throw new Error('Method not implemented.');
  }
}
