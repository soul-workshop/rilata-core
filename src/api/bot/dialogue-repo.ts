import { Repositoriable } from '#api/resolve/repositoriable.js';
import { DTO } from '#domain/dto.js';
import { DialogueContext } from './types.js';

export interface BotDialogueRepository {
  getActive<R extends DTO>(telegramId: number): DialogueContext<R> | undefined

  add(conext: DialogueContext<DTO>): void
}

export const BotDialogueRepository = {
  instance(resolver: Repositoriable): BotDialogueRepository {
    return resolver.resolveRepo(BotDialogueRepository) as BotDialogueRepository;
  },
};
