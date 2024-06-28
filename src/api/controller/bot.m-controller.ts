import { Update } from '@grammyjs/types';
import { TELEGRAM_API } from '#api/http.index.js';
import { GeneralBotModuleResolves } from '#api/module/bot-types.js';
import { ModuleResolver } from '#api/module/m-resolver.js';
import { GeneralServerResolver } from '#api/server/types.js';
import { ModuleController } from './m-controller.js';
import { BotReplyMessage } from '#api/bot/types.js';

export class BotModuleController extends ModuleController {
  constructor(protected botName: string, protected botToken: string) {
    super();
  }

  declare resolver: ModuleResolver<GeneralServerResolver, GeneralBotModuleResolves>;

  async execute(req: Request): Promise<void> {
    try {
      const update = await req.json() as Update;
      const module = this.resolver.getModule();
      const body = await module.executeService(this.botName, update);
      if ((body as BotReplyMessage).method === 'notResponse') return;

      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };
      const fetchResult = await fetch(this.getBotUrl(), payload);
      if (!fetchResult.ok) {
        this.resolver.getLogger().error('Ошибка при отпраке данных в телеграм сервер', {
          update, payload,
        });
      }
    } catch (e) {
      this.resolver.getLogger().error('Ошибка сериализации данных json', {
        reqBlob: await req.blob(),
      });
    }
  }

  protected getBotUrl(): string {
    return `${TELEGRAM_API}bot${this.botToken}`;
  }
}
