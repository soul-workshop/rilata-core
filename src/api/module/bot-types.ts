import { BotModuleResolver } from '#api/module/bot.m-resolver.js';
import { BotModuleResolves } from '#api/module/bot.m-resolves.js';
import { BotModule } from '#api/module/bot.module.js';
import { GeneralServerResolver } from '#api/server/types.js';

export type GeneralBotModuleResolves = BotModuleResolves<BotModule>

export type GeneralBotModuleResolver = BotModuleResolver<
  GeneralServerResolver, GeneralBotModuleResolves
>

export type GetUpdatesMode = {
  type: 'getUpdates',
  timeoutAsSec: number,
}

export type WebhookMode = {
  type: 'webhook',
}

export type BotSubscribeMode = GetUpdatesMode | WebhookMode
