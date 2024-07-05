/* eslint-disable max-len */
import { Asyncable } from '#api/database/types.js';
import { Repositoriable } from '#api/resolve/repositoriable.js';
import { DTO } from '#domain/dto.js';
import { DialogueContext, FinishContextAttrs, UpdateContextAttrs } from './types.js';

export interface BotDialogueRepository<ASYNC extends boolean, CTX extends DialogueContext<DTO, string>> {
  findActive(telegramId: string): Asyncable<ASYNC, CTX | undefined>

  findAll(telegramId: string): CTX[]

  add(conext: Omit<CTX, 'isActive' | 'lastUpdate'>): Asyncable<ASYNC, void>

  updateContext(telegramId: string, attrs: UpdateContextAttrs): void

  finishContext(telegramId: string, attrs: FinishContextAttrs): void

  getNow(): number
}

export const BotDialogueRepository = {
  instance<A extends boolean, CTX extends DialogueContext<DTO, string>>(
    resolver: Repositoriable,
  ): BotDialogueRepository<A, CTX> {
    return resolver.resolveRepo(BotDialogueRepository) as BotDialogueRepository<A, CTX>;
  },
};
