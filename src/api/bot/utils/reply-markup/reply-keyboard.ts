import { KeyboardButton, ReplyKeyboardMarkup } from '@grammyjs/types';

export class ReplyKeyboardBuilder {
  private options: Omit<ReplyKeyboardMarkup, 'keyboard'> = {};

  private rows: KeyboardButton.CommonButton[][] = [];

  makeReplyMarkup(): { reply_markup: ReplyKeyboardMarkup } {
    return { reply_markup: this.make() };
  }

  addButtonRow(text: string): this {
    this.pushRow([{ text }]);
    return this;
  }

  pushRow(row: KeyboardButton.CommonButton[]): this {
    this.rows.push(row);
    return this;
  }

  setOption(options: Omit<ReplyKeyboardMarkup, 'keyboard'>): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  make(): ReplyKeyboardMarkup {
    return {
      keyboard: [...this.rows],
      ...this.options,
    };
  }
}
