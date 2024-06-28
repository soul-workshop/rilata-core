/* eslint-disable no-underscore-dangle */
import { Update } from '@grammyjs/types';
import { BotState } from './state.js';
import { BotReplyMessage, DialogueContext } from './types.js';
import { BotDialogueRepository } from './dialogue-repo.js';
import { GeneralBotModuleResolver, Service } from '#api/base.index.js';
import { updateUtils } from './utils/update.ts';
import { Constructor } from '#core/types.js';
import { DTO } from '#domain/dto.js';

export abstract class BotDialogueRouter extends Service<GeneralBotModuleResolver> {
  abstract aRootName: string;

  abstract serviceName: string;

  abstract handleName: string;

  abstract moduleName: string;

  protected get moduleResolver(): GeneralBotModuleResolver {
    return this._moduleResolver;
  }

  protected _moduleResolver!: GeneralBotModuleResolver;

  protected abstract stateCtors: Constructor<BotState>[];

  protected states!: BotState[];

  init(resolver: GeneralBotModuleResolver): void {
    this._moduleResolver = resolver;
    this.states = this.stateCtors.map((Ctor) => new Ctor());
    this.states.forEach((state) => state.init(this.moduleResolver));
  }

  execute(update: Update): Promise<BotReplyMessage> {
    const telegramId = updateUtils.getChatId(update);
    const dialogue = this.getDialogue(telegramId);
    const state = dialogue
      ? this.getState(dialogue.stateName)
      : this.getState('botStart');

    return state.execute(update);
  }

  protected getDialogue(telegramId: number): DialogueContext<DTO> | undefined {
    const dialogueRepo = BotDialogueRepository.instance(this.moduleResolver);
    return dialogueRepo.getActive(telegramId);
  }

  protected getState<S extends BotState>(stateName: S['stateName']): S {
    const state = this.states.find((s) => s.stateName === stateName);
    if (!state) {
      throw this.moduleResolver.getLogger().error(`not finded state by name: ${stateName}`);
    }
    return state as S;
  }
}
