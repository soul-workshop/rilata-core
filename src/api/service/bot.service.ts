import { Service } from './service.js';
import { GeneralModuleResolver } from '../module/types.js';
import { TelegramMessage, Update } from '#api/telegram/types.js';

export abstract class BotService<RES extends GeneralModuleResolver> extends Service<RES> {
  abstract botName: string;

  get handleName(): string {
    return this.botName;
  }

  abstract execute(update: Update): Promise<TelegramMessage>
}
