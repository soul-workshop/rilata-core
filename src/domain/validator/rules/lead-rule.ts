import { LiteralDataType } from './types';

export interface LeadRule<V extends LiteralDataType> {
  lead(value: V): V
}
