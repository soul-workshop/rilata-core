import { Message } from '@grammyjs/types';
import { entityUtils } from './entity.ts';

class MessageUtils {
  isTextMessage(msg?: Message): msg is Message.TextMessage {
    return Boolean(msg && msg.text);
  }

  isCommand(msg: Message): boolean {
    return entityUtils.getEntities('bot_command', msg.entities).length > 0;
  }

  hasCommand(msg: Message, command: string): boolean {
    return entityUtils.getEntityValues(
      entityUtils.getEntities('bot_command', msg.entities),
      msg.text,
    ).includes(command);
  }
}

export const messageUtils = new MessageUtils();
