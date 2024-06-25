import { BotModule } from './bot.module.ts';
import { ModuleResolves } from './m-resolves.ts';

export type BotModuleResolves<M extends BotModule> = ModuleResolves<M> & {
  botToken: string,
  botName: string,
}
