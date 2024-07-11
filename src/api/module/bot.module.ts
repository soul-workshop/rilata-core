/* eslint-disable no-underscore-dangle */
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

type TelegramId = string;

type GetUpdatesData = {
  mode: 'activeMode' | 'passiveMode',
  timer: Timer,
  atLastUpdate: number,
  newUpdateId?: number,
}

export abstract class BotModule extends Module {
  protected abstract services: BotDialogueRouter[];

  declare protected moduleController: BotModuleController;

  declare protected moduleResolver: ModuleResolver<GeneralServerResolver, GeneralBotModuleResolves>;

  protected botName!: string;

  protected botToken!: string;

  protected botSubscribeMode!: BotSubscribeMode;

  protected updatesConfig_?: GetUpdatesMode;

  protected get updatesConfig(): GetUpdatesMode {
    if (!this.updatesConfig_) {
      throw this.logger.error('should not have been called without first being installed');
    }
    return this.updatesConfig_;
  }

  protected updatesData_?: GetUpdatesData;

  protected get updatesData(): GetUpdatesData {
    if (!this.updatesData_) {
      throw this.logger.error('should not have been called without first being installed');
    }
    return this.updatesData_;
  }

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
    this.services.forEach((s) => (s as any).init(this.moduleResolver)); // s BotDialogue
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
      const resolves = this.moduleResolver.getModuleResolves();
      this.unSubscribeFromWebhook().then(() => {
        this.moduleResolver.getLogger().info('successfully webhook unsubscribed for bot');
        this.updatesConfig_ = resolves.botSubscribeMode as GetUpdatesMode;
        this.subscribeGetUpdates();
        this.logger.info(`successfully subscribed for bot: ${this.botName}. Mode: ${this.botSubscribeMode.type}.`);
      });
    } else {
      this.subscribeToWebHook();
    }
  }

  stop(): void {
    if (this.updatesData?.timer) {
      clearInterval(this.updatesData.timer);
    } else {
      this.unSubscribeFromWebhook();
    }
  }

  protected async subscribeToWebHook(): Promise<void> {
    const resolves = this.moduleResolver.getServerResolver().getServerResolves();
    const { publicPort, publicHost, logger } = resolves;
    const port = publicPort === 80 ? '' : `:${publicPort}`;
    const host = `${publicHost}${port}`;
    const { botName } = this.moduleResolver.getModuleResolves();
    const params: ApiMethodsParams<'setWebhook'> = {
      method: 'setWebhook',
      url: `https://${host}/${botName}`,
    };

    const controller = this.getModuleController();
    const response = await controller.postRequest(params);
    if (!response.ok) {
      throw logger.error('Failed to subscribe to telegram webhook');
    }
  }

  protected async unSubscribeFromWebhook(): Promise<void> {
    const controller = this.getModuleController();
    const response = await controller.postRequest({ method: 'deleteWebhook' });
    if (!response.ok) {
      throw new Error('Failed to unsubscribe from webhook');
    }
  }

  protected subscribeGetUpdates(lastUpdate?: Update): void {
    const subscribe = (timeout: number): Timer => setTimeout(
      this.getAndProcessUpdates.bind(this),
      timeout,
    );

    const isFirstSubsribe = !this.updatesData_;
    if (isFirstSubsribe) {
      this.updatesData_ = {
        timer: subscribe(0),
        mode: 'activeMode',
        atLastUpdate: Date.now(),
      };
      return;
    }
    if (lastUpdate) {
      this.updatesData.newUpdateId = lastUpdate.update_id + 1;
      this.updatesData.atLastUpdate = Date.now();
    }
    if (this.updatesData.mode === 'activeMode' && !lastUpdate) {
      const timeShift = Date.now() - this.updatesData.atLastUpdate;
      const needToPassive = timeShift > this.updatesConfig.timeoutToPassive;
      if (needToPassive) {
        this.updatesData.mode = 'passiveMode';
      }
    } else if (this.updatesData.mode === 'passiveMode' && lastUpdate) {
      this.updatesData.mode = 'activeMode';
    }
    const timeout = this.updatesData.mode === 'activeMode'
      ? this.updatesConfig.activeModeTimout
      : this.updatesConfig.passiveModeTimeout;
    this.updatesData.timer = subscribe(timeout);
  }

  protected async getAndProcessUpdates(): Promise<void> {
    const updates = await this.getUpdates();
    if (updates.length > 0) {
      const updatesByUsers = this.getUpdatesByUsers(updates);
      await this.processUpdates(updatesByUsers);
      const lastUpdate = updates[updates.length - 1];
      this.subscribeGetUpdates(lastUpdate);
    } else this.subscribeGetUpdates();
  }

  protected async getUpdates(): Promise<Update[]> {
    const body: ApiMethodsParams<'getUpdates'> = {
      method: 'getUpdates',
      offset: this.updatesData.newUpdateId,
      allowed_updates: ['message', 'callback_query'],
    };
    try {
      const response = await this.moduleController.postRequest(body);
      if (response.ok) return (await response.json()).result as Update[];

      this.logger.error(
        `Запрос getUpdates на сервер telegram вернул ошибку. Status: ${response.status}: StatusText: ${response.statusText}.`,
        { response: await response.json() },
      );
      return [];
    } catch (e) {
      this.logger.error(
        `Не удалось выполнить запрос getUpdates на сервер telegram: ${(e as Error).message}`,
        { body, url: this.getBotUrl() },
        e as Error,
      );
      return [];
    }
  }

  protected async processUpdates(usersUpdates: Record<TelegramId, Update[]>): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const [telegramId, userUpdates] of Object.entries(usersUpdates)) {
      if (userUpdates.length > 1) {
        this.logger.warning(`Бот получил ${userUpdates.length} сообщений для пользователя ${telegramId}. Будет обработано только последнее сообщение (режим диалога).`);
      }
      const update = userUpdates[userUpdates.length - 1];
      // запускаем последовательно для уменьшения вероятности ошибко
      // eslint-disable-next-line no-await-in-loop
      await this.moduleController.executeUpdate(update);
    }
  }

  protected getUpdatesByUsers(updates: Update[]): Record<TelegramId, Update[]> {
    const result: Record<TelegramId, Update[]> = {};
    updates.forEach((update) => {
      const telegramId = updateUtils.getChatId(update);
      if (telegramId in result) result[telegramId].push(update);
      else result[telegramId] = [update];
    });
    return result;
  }

  getBotUrl(): string {
    return `${TELEGRAM_API}bot${this.botToken}`;
  }
}
