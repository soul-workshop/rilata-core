import { ActionType } from './types';

export interface Actionable {
  readonly actionType: ActionType

  readonly actionName: string;

  actionIsAvailable(userId: string, ...args: unknown[]): Promise<boolean>
}
