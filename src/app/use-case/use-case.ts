import { Logger } from '../../common/logger/logger';
import { ActionType, GeneralInstanceActionable } from './actionable/types';
import { Actionable } from './actionable/actionable';

export abstract class UseCase implements Actionable {
  abstract actionType: ActionType;

  abstract actionName: string;

  abstract getAction(userId: string, ...args: unknown[]): Promise<Record<string, boolean>>;

  protected logger!: Logger;

  init(logger: Logger): void {
    this.logger = logger;
  }

  abstract execute(...args: unknown[]): Promise<unknown>

  isInstanceActionable(): this is GeneralInstanceActionable {
    return this.actionType === 'instance';
  }

  isClassActionable(): this is GeneralInstanceActionable {
    return this.actionType === 'class';
  }
}
