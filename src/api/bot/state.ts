import { Update } from '@grammyjs/types';
import { BotReplyMessage } from './types.ts';
import { BotDialogueRouter } from './dialogue-router.ts';
import { GeneralModuleResolver } from '#api/module/types.js';

export abstract class BotState {
  abstract stateName: string;

  protected resolver!: GeneralModuleResolver;

  protected router!: BotDialogueRouter;

  // eslint-disable-next-line max-len
  init(resolver: GeneralModuleResolver, router: BotDialogueRouter): void {
    this.resolver = resolver;
    this.router = router;
  }

  abstract execute(update: Update): Promise<BotReplyMessage>
}
