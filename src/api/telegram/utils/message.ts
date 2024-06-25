import { Message } from '@grammyjs/types';

class MessageUtils {
  isTextMessage(msg?: Message): msg is Message.TextMessage {
    return !!msg && (msg.text === 'string');
  }
}

export const messateUtils = new MessageUtils();
