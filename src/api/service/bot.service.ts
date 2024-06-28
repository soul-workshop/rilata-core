import { Update } from '@grammyjs/types';
import { Service } from './service.js';
import { GeneralModuleResolver } from '../module/types.js';
import { BotReplyMessage } from '#api/bot/types.js';

export abstract class BotService<RES extends GeneralModuleResolver> extends Service<RES> {
  abstract botName: string;

  get handleName(): string {
    return this.botName;
  }

  abstract execute(update: Update): Promise<BotReplyMessage>
}
