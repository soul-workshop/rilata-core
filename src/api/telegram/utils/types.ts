import { ForceReply, InlineKeyboardMarkup, MessageEntity, ReplyKeyboardMarkup } from '@grammyjs/types';

export type ReplyToChat = {
  chat_id: number | string;
  text: string;
  entities?: MessageEntity[];
  reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        // | ReplyKeyboardRemove
        | ForceReply;
}
