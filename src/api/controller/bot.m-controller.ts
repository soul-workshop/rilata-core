import { BotReplyMessage, Update } from '#api/telegram/types.js';
import { ModuleController } from './m-controller.js';

const TELEGRAM_API = 'https://api.telegram.org/';

export class BotModuleController extends ModuleController {
  constructor(protected botName: string, protected botToken: string) {
    super();
  }

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
      const fetchResult = await fetch(this.fullUrl(), payload);
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

  protected fullUrl(): string {
    return `${TELEGRAM_API}bot${this.botToken}`;
  }
}
