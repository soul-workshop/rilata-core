import { KeyboardButton, ReplyKeyboardMarkup } from '@grammyjs/types';

type Options = Omit<ReplyKeyboardMarkup, 'keyboard'>;
export class ReplyKeyboardBuilder {
  private options: Options = {
    one_time_keyboard: true,
    resize_keyboard: true,
  };

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

  empty(): this {
    this.rows = [];
    this.options = {};
    return this;
  }

  setOption(options: Partial<Options>): this {
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
