import { InlineKeyboardButton, InlineKeyboardMarkup } from '@grammyjs/types';

export class InlineKeyboard {
  private rows: InlineKeyboardButton[][] = [];

  makeReplyMarkup(): { reply_markup: InlineKeyboardMarkup } {
    return { reply_markup: this.make() };
  }

  make(): InlineKeyboardMarkup {
    return {
      inline_keyboard: this.rows,
    };
  }

  addCbButtonRow(text: string, callback: string, ...args: string[]): this {
    const joinedArgs = [text, callback, ...args];
    if (joinedArgs.length % 2 !== 0) throw Error(`Не парный вызов аргументов: ${joinedArgs.join(', ')}`);
    const row: InlineKeyboardButton[] = [];
    for (let i = 0; i < joinedArgs.length; i += 2) {
      row.push(this.makeCallbackButton(joinedArgs[i], joinedArgs[i + 1]));
    }
    this.pushRow(row);
    return this;
  }

  pushRow(row: InlineKeyboardButton[]): this {
    this.rows.push(row);
    return this;
  }

  // eslint-disable-next-line max-len
  private makeCallbackButton(text: string, callbackData: string): InlineKeyboardButton.CallbackButton {
    return { text, callback_data: callbackData };
  }
}
