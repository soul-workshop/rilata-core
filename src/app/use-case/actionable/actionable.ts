import { ActionType } from './types';

export interface Actionable {
  actionType: ActionType

  actionName: string;

  getAction(userId: string, ...args: unknown[]): Promise<Record<string, boolean>>
}
