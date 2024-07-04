import { Update } from '@grammyjs/types';

class UpdateUtils {
  getChatId(upd: Update): string {
    let chatId: number | undefined;
    if (upd.message) chatId = upd.message.chat.id;
    else if (upd.edited_message) chatId = upd.edited_message.chat.id;
    else if (upd.channel_post) chatId = upd.channel_post.chat.id;
    else if (upd.edited_channel_post) chatId = upd.edited_channel_post.chat.id;
    else if (
      upd.callback_query && upd.callback_query.message
    ) chatId = upd.callback_query.message.chat.id;
    else if (upd.inline_query) chatId = upd.inline_query.from.id;
    else if (upd.chosen_inline_result) chatId = upd.chosen_inline_result.from.id;
    else if (upd.shipping_query) chatId = upd.shipping_query.from.id;
    else if (upd.pre_checkout_query) chatId = upd.pre_checkout_query.from.id;
    else if (upd.poll_answer) chatId = upd.poll_answer.user?.id;
    else if (upd.my_chat_member) chatId = upd.my_chat_member.chat.id;
    else if (upd.chat_member) chatId = upd.chat_member.chat.id;
    else if (upd.chat_join_request) chatId = upd.chat_join_request.chat.id;
    if (chatId === undefined) throw Error('not found chat_id for update');
    return String(chatId);
  }
}
export const updateUtils = new UpdateUtils();
