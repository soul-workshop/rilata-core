import { ForceReply as ForceReplyType } from '@grammyjs/types';

export class ForceReplyBuilder {
  private placeholder?: string;

  private selective?: boolean;

  makeReplyMarkup(): { reply_markup: ForceReplyType } {
    return { reply_markup: this.make() };
  }

  setPlaceholder(text: string): this {
    this.placeholder = text;
    return this;
  }

  setSelective(value: boolean): this {
    this.selective = value;
    return this;
  }

  make(): ForceReplyType {
    return {
      force_reply: true,
      input_field_placeholder: this.placeholder,
      selective: this.selective,
    };
  }
}
