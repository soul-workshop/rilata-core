import { Update } from '@grammyjs/types';
import { GeneralBotModuleResolver } from '#api/base.index.js';
import { BotReplyMessage } from './types.ts';

export abstract class BotState {
  abstract stateName: string;

  protected resolver!: GeneralBotModuleResolver;

  init(resolver: GeneralBotModuleResolver): void {
    this.resolver = resolver;
  }

  abstract execute(update: Update): Promise<BotReplyMessage>
}
