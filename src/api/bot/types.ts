import { Timestamp } from '#core/types.js';
import { DTO } from '#domain/dto.js';
import { ApiMethods } from '@grammyjs/types';

export type DialogueContext<R extends DTO> = {
  telegramId: number;
  isActive: boolean;
  stateName: string;
  lastUpdate: Timestamp;
  payload: R;
}

export type NotResponse = {
  method: 'notResponse',
}

export type SendMessage = Parameters<ApiMethods<unknown>['sendMessage']>[0] & {
  method: 'sendMessage',
}

export type GetUpdatesMessage = Parameters<ApiMethods<unknown>['getUpdates']>[0] & {
  method: 'getUpdates',
}

export type BotReplyMessage = NotResponse
  | SendMessage;
