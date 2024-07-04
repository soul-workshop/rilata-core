/* eslint-disable @typescript-eslint/no-explicit-any */
import { Update } from '@grammyjs/types';
import { BotModuleController } from '#api/controller/bot.m-controller.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { BotSubscribeMode, GeneralBotModuleResolves, GetUpdatesMode } from './bot-types.ts';
import { ModuleResolver } from './m-resolver.ts';
import { Module } from './module.js';
import { ApiMethodsParams, BotReplyMessage, SendMessage } from '#api/bot/types.js';
import { TELEGRAM_API } from '#api/controller/constants.js';
import { BotDialogueRouter } from '#api/bot/dialogue-router.js';
import { updateUtils } from '#api/bot/utils/update.js';

export abstract class BotModule extends Module {
  protected abstract services: BotDialogueRouter[];

  declare protected moduleController: BotModuleController;

  declare protected moduleResolver: ModuleResolver<GeneralServerResolver, GeneralBotModuleResolves>;

  protected botName!: string;

  protected botToken!: string;

  protected botSubscribeMode!: BotSubscribeMode;

  protected newUpdateId = 0;

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
    this.services.forEach((s) => s.init(this.moduleResolver));
    this.subscribeToUpdates();
  }

  getModuleController(): BotModuleController {
    return this.moduleController;
  }

  async executeService(routerName: string, update: Update): Promise<BotReplyMessage> {
    try {
      const service = this.getService(routerName) as BotDialogueRouter;
      return service.execute(update);
    } catch (e) {
      this.logger.error(
        `Ошибка при обработке запроса телеграм. Err: ${(e as Error).message}`,
        { serviceName: routerName, update },
        e as Error,
      );
      const msg: SendMessage = {
        method: 'sendMessage',
        chat_id: updateUtils.getChatId(update),
        parse_mode: 'Markdown',
        text: '**К сожалению произошла непредвиденная ошибка.**\nПопробуйте еще раз, но с большой вероятностью ошибка полностью на нашей стороне.\nМы занимаемся этой ошибкой, но просим помочь вас и переслать это сообщение лицу которое предоставило ссылку на этот бот.',
      };
      return msg;
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
    const data: ApiMethodsParams<'setWebhook'> = {
      method: 'setWebhook',
      url: 'смотри в избранных в телеге, чтобы настроить через ngrok',
    };
    throw Error('not implemnented');
  }

  protected async unSubscribeFromWebhook(): Promise<void> {
    throw Error('not implemnented');
  }

  protected subscribeGetUpdates(): void {
    this.timer = setTimeout(
      this.getAndProcessUpdates.bind(this),
      (this.botSubscribeMode as GetUpdatesMode).timeoutAsSec * 1000,
    );
  }

  protected async getAndProcessUpdates(): Promise<void> {
    const update = await this.getLastUpdate();
    if (update) {
      await this.moduleController.executeUpdate(update);
    }
    this.subscribeGetUpdates();
  }

  protected async getLastUpdate(): Promise<Update | undefined> {
    const body: ApiMethodsParams<'getUpdates'> = {
      method: 'getUpdates',
      offset: this.newUpdateId || undefined,
      allowed_updates: ['message', 'callback_query'],
    };
    try {
      const response = await this.moduleController.postRequest(body);
      if (response.ok) {
        const updates = (await response.json()).result as Update[];
        if (updates.length === 0) return;
        if (updates.length > 1) {
          this.logger.warning(`Бот получил ${updates.length} сообщений. Будет обработано только последнее сообщение (режим диалога).`);
        }
        const update = updates[updates.length - 1];
        this.newUpdateId = update.update_id + 1;
        // eslint-disable-next-line consistent-return
        return update;
      }
    } catch (e) {
      this.logger.error(
        'Ошибка при запросе или обработке Updates: ',
        { body, url: this.getBotUrl() },
        e as Error,
      );
    }
  }

  getBotUrl(): string {
    return `${TELEGRAM_API}bot${this.botToken}`;
  }
}
