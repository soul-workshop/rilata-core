/* eslint-disable no-underscore-dangle */
import { Update } from '@grammyjs/types';
import { BotState } from './state.js';
import { ApiMethodNames, ApiMethodsParams, BotReplyMessage, DialogueContext, SendMessage } from './types.js';
import { BotDialogueRepository } from './dialogue-repo.js';
import { updateUtils } from './utils/update.ts';
import { Constructor } from '#core/types.js';
import { DTO } from '#domain/dto.js';
import { Service } from '#api/service/service.js';
import { GeneralModuleResolver } from '#api/module/types.js';
import { BotModuleController } from '#api/controller/bot.m-controller.js';

export abstract class BotDialogueRouter extends Service<GeneralModuleResolver> {
  protected abstract stateCtors: Constructor<BotState>[];

  protected states!: BotState[];

  protected _moduleResolver!: GeneralModuleResolver;

  get moduleResolver(): GeneralModuleResolver {
    return this._moduleResolver;
  }

  init(resolver: GeneralModuleResolver): void {
    this._moduleResolver = resolver;
    this.states = this.stateCtors.map((Ctor) => new Ctor());
    this.states.forEach((state) => state.init(this._moduleResolver, this));
  }

  async execute(update: Update): Promise<BotReplyMessage> {
    try {
      const telegramId = updateUtils.getChatId(update);
      const dialogue = this.getContext(telegramId);
      const state = dialogue
        ? this.getState(dialogue.stateName)
        : this.getState('botStart');

      return state.execute(update);
    } catch (e) {
      const chatId = updateUtils.getChatId(update);
      const context = this.getContext(chatId);
      this.moduleResolver.getLogger().error(
        `Произошла ошибка. Err: ${(e as Error).message}`,
        { update, context },
        e as Error,
      );
      const msg: SendMessage = {
        method: 'sendMessage',
        chat_id: chatId,
        text: 'К сожалению произошла непредвиденная ошибка. Попробуйте еще раз. Если ошибка будет повторяться, то рекомендуем завершить текущий диалог (возможно через команду /cancel) и начать диалог заново.',
      };
      return msg;
    }
  }

  async sendByBot(promise: Promise<ApiMethodsParams<ApiMethodNames>>): Promise<void> {
    const params = await promise;
    const controller = this.moduleResolver.getModule().getModuleController() as BotModuleController;
    controller.postRequest(params);
  }

  getState<S extends BotState>(stateName: S['stateName']): S {
    const state = this.states.find((s) => s.stateName === stateName);
    if (!state) {
      throw this.moduleResolver.getLogger().error(`not finded state by name: ${stateName}`);
    }
    return state as S;
  }

  protected getContext(telegramId: string): DialogueContext<DTO, string> | undefined {
    const dialogueRepo = BotDialogueRepository.instance<
      false, DialogueContext<DTO, string>
    >(this.moduleResolver);
    return dialogueRepo.findActive(telegramId);
  }
}
