import { Update as TelegramUpdate, ApiMethods } from '@grammyjs/types';

export type Update = TelegramUpdate;

export type NotResponse = {
  method: 'notResponse',
}

export type SendMessage = {
  method: 'sendMessage',
  args: Parameters<ApiMethods<unknown>['sendMessage']>
}

export type BotReplyMessage = NotResponse
  | SendMessage;
