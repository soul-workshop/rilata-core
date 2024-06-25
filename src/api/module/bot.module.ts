/* eslint-disable @typescript-eslint/no-explicit-any */
import { BotModuleController } from '#api/controller/bot.m-controller.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { BotService } from '#api/service/bot.service.js';
import { BotReplyMessage, Update } from '#api/telegram/types.js';
import { Module } from './module.js';
import { GeneralModuleResolver } from './types.js';

export abstract class BotModule extends Module {
  protected abstract services: BotService<GeneralModuleResolver>[];

  declare protected moduleController: BotModuleController;

  init(
    moduleResolver: GeneralModuleResolver,
    serverResolver: GeneralServerResolver,
  ): void {
    super.init(moduleResolver, serverResolver);
    this.moduleController = new BotModuleController(
      // moduleResolver is botModuleResolver, для исключения циклических ссылок типов
      (moduleResolver as any).getBotName(), (moduleResolver as any).getBotToken(),
    );
  }

  async executeService(botName: string, update: Update): Promise<BotReplyMessage> {
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
