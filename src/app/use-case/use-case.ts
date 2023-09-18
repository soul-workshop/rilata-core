import { ActionType, GeneralInstanceActionable } from './actionable/types';
import { Actionable } from './actionable/actionable';
import { ModuleResolver } from '../../conf/module-resolver';
import { Logger } from '../../common/logger/logger';

export abstract class UseCase implements Actionable {
  readonly abstract actionType: ActionType;

  readonly abstract actionName: string;

  abstract actionIsAvailable(userId: string, ...args: unknown[]): Promise<boolean>;

  protected moduleResolver!: ModuleResolver;

  protected logger!: Logger;

  init(moduleResolver: ModuleResolver): void {
    this.moduleResolver = moduleResolver;
  }

  abstract execute(...args: unknown[]): Promise<unknown>

  isInstanceActionable(): this is GeneralInstanceActionable {
    return this.actionType === 'instance';
  }

  isClassActionable(): this is GeneralInstanceActionable {
    return this.actionType === 'class';
  }
}
