import { Update } from '@grammyjs/types';
import {
  BotModule, BotModuleResolves,
  GeneralServerResolver, ModuleResolver,
} from '#api/base.index.js';
import { BotReplyMessage } from './types.ts';
import { BotDialogueRouter } from './dialogue-router.ts';

// тип создан для избегания циклической ссылки
type BotResolver = ModuleResolver<GeneralServerResolver, BotModuleResolves<BotModule>>;

export abstract class BotState {
  abstract stateName: string;

  protected resolver!: BotResolver;

  protected router!:BotDialogueRouter;

  init(resolver: BotResolver, router: BotDialogueRouter): void {
    this.resolver = resolver;
    this.router = router;
  }

  abstract execute(update: Update): Promise<BotReplyMessage>
}
