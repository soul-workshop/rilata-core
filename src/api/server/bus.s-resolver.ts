import { Bus } from '../bus/bus';

export interface BusServerResolver{
  getBus(): Bus
}
