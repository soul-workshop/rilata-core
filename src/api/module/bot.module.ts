/* eslint-disable @typescript-eslint/no-explicit-any */
import { Update } from '@grammyjs/types';
import { BotModuleController } from '#api/controller/bot.m-controller.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { BotService } from '#api/service/bot.service.js';
import { BotSubscribeMode, GeneralBotModuleResolves, GetUpdatesMode } from './bot-types.ts';
import { ModuleResolver } from './m-resolver.ts';
import { Module } from './module.js';
import { GeneralModuleResolver } from './types.js';
import { BotReplyMessage, GetUpdatesMessage } from '#api/bot/types.js';
import { TELEGRAM_API } from '#api/controller/constants.js';

export abstract class BotModule extends Module {
  protected abstract services: BotService<GeneralModuleResolver>[];

  declare protected moduleController: BotModuleController;

  declare protected moduleResolver: ModuleResolver<GeneralServerResolver, GeneralBotModuleResolves>;

  protected botName!: string;

  protected botToken!: string;

  protected botSubscribeMode!: BotSubscribeMode;

  protected lastUpdateId = 0;

  protected timer?: Timer;

  init(
    moduleResolver: ModuleResolver<GeneralServerResolver, GeneralBotModuleResolves>,
    serverResolver: GeneralServerResolver,
  ): void {
    this.moduleResolver = moduleResolver;
    const resolves = moduleResolver.getModuleResolves();
    this.botToken = resolves.botToken;
    this.botName = resolves.botName;
    this.botSubscribeMode = resolves.botSubscribeMode;
    this.moduleController = new BotModuleController(this.botName, this.botToken);
    super.init(moduleResolver, serverResolver);
    this.subscribeToUpdates();
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

  protected subscribeToUpdates(): void {
    if (this.botSubscribeMode.type === 'getUpdates') {
      this.subscribeGetUpdates();
      this.logger.info(`successfully subscribed for bot: ${this.botName}. Mode: ${this.botSubscribeMode.type}. Update time (sec): ${this.botSubscribeMode.timeoutAsSec}`);
    } else {
      this.subscribeToWebHook();
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.unSubscribeFromWebhook();
    }
  }

  protected async subscribeToWebHook(): Promise<void> {
    throw Error('not implemnented');
  }

  protected async unSubscribeFromWebhook(): Promise<void> {
    throw Error('not implemnented');
  }

  protected subscribeGetUpdates(): void {
    this.timer = setTimeout(
      this.getAndProcessUpdates.bind(this),
      (this.botSubscribeMode as GetUpdatesMode).timeoutAsSec,
    );
  }

  protected async getAndProcessUpdates(): Promise<void> {
    const body: GetUpdatesMessage = {
      method: 'getUpdates',
      offset: this.lastUpdateId || undefined,
      allowed_updates: ['message', 'callback_query'],
    };
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    try {
      const response = await fetch(`${this.getBotUrl()}`, data);
      if (response.ok) {
        const updates = (await response.json()).result as Update[];
        if (updates.length === 0) return;
        if (updates.length > 1) {
          this.logger.warning(`Бот получил ${updates.length} сообщений. Будет обработано только последнее сообщение (режим диалога).`);
        }
        const update = updates[updates.length - 1];
        this.lastUpdateId = update.update_id;
        await this.executeService(this.botName, update);
      } else {
        const resp = {
          ok: response.ok,
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          headers: JSON.stringify([...Object.entries(response.headers)]),
          redirected: response.redirected,
          bodyUsed: response.bodyUsed,
          body: await response.text(),
        };
        this.logger.warning(
          'Неудачный вызов телеграм сервера с getUpdates: ', { data, url: this.getBotUrl(), response: resp },
        );
      }
      this.subscribeGetUpdates();
    } catch (e) {
      this.logger.error(
        'Ошибка при запросе или обработке Updates: ',
        { data, url: this.getBotUrl() },
        e as Error,
      );
    }
  }

  protected getBotUrl(): string {
    return this.botSubscribeMode.type === 'getUpdates'
      ? `http://${TELEGRAM_API}bot${this.botToken}/`
      : `https://${TELEGRAM_API}bot${this.botToken}/`;
  }
}
