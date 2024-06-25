import { BotService } from '#api/service/bot.service.js';
import { TelegramMessage, Update } from '#api/telegram/types.js';
import { Module } from './module.js';
import { GeneralModuleResolver } from './types.js';

export abstract class BotModule extends Module {
  protected abstract services: BotService<GeneralModuleResolver>[];

  async executeService(botName: string, update: Update): Promise<TelegramMessage> {
    try {
      const service = this.getService(botName) as BotService<GeneralModuleResolver>;
      return service.execute(update);
    } catch (e) {
      this.logger.error(
        'Ошибка при обработке запроса телеграм',
        { serviceName: botName, update },
        e as Error,
      );
      return { method: 'notResponse' };
    }
  }
}
