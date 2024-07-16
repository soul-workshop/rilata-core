import { Update } from '@grammyjs/types';
import { BotReplyMessage, DialogueContext } from './types.ts';
import { MaybePromise } from '#core/types.js';
import { BotDialogueRouter } from './dialogue-router.ts';
import { GeneralModuleResolver } from '#api/base.index.js';
import { DTO } from '#domain/dto.js';

export abstract class BotMiddleware<C extends DialogueContext<DTO, string>> {
  protected resolver!: GeneralModuleResolver;

  protected router!: BotDialogueRouter;

  init(resolver: GeneralModuleResolver, router: BotDialogueRouter): void {
    this.resolver = resolver;
    this.router = router;
  }

  protected findContext(telegramId: string): C | undefined {
    return this.router.findContext(telegramId) as C;
  }

  abstract process(update: Update): MaybePromise<BotReplyMessage | undefined>
}
