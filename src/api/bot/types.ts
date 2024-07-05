import { ApiMethods } from '@grammyjs/types';
import { Timestamp } from '#core/types.js';
import { DTO } from '#domain/dto.js';

export type DialogueContext<R extends DTO, SN extends string> = {
  telegramId: string;
  isActive: boolean;
  stateName: SN;
  lastUpdate: Timestamp;
  payload: R;
}

export type NotResponse = {
  method: 'notResponse',
}

export type UpdateContextAttrs = Partial<Pick<DialogueContext<DTO, string>, 'stateName' | 'payload'>>

export type FinishContextAttrs = Partial<Pick<DialogueContext<DTO, string>, 'stateName' | 'payload'>>

export type ApiMethodNames = keyof ApiMethods<unknown>;

export type ApiMethodsParams<K extends ApiMethodNames> =
  Parameters<ApiMethods<unknown>[K]>[0] & { method: K };

export type SendMessage = ApiMethodsParams<'sendMessage'>;

export type BotReplyMessage = NotResponse
  | SendMessage;
