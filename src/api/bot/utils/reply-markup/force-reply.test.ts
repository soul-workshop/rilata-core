import { describe, test, expect } from 'bun:test';
import { ForceReplyBuilder } from './force-reply.js';

describe('ForceReplyBuilder', () => {
  test('должен создать ForceReply с force_reply: true', () => {
    const result = new ForceReplyBuilder().make();
    expect(result).toEqual({
      force_reply: true,
      input_field_placeholder: undefined,
      selective: undefined,
    });
  });

  test('должен установить placeholder с помощью setPlaceholder', () => {
    const result = new ForceReplyBuilder().setPlaceholder('Введите текст').make();
    expect(result).toEqual({
      force_reply: true,
      input_field_placeholder: 'Введите текст',
      selective: undefined,
    });
  });

  test('должен установить selective с помощью setSelective', () => {
    const result = new ForceReplyBuilder().setSelective(true).make();
    expect(result).toEqual({
      force_reply: true,
      input_field_placeholder: undefined,
      selective: true,
    });
  });

  test('должен создать объект reply_markup с force_reply', () => {
    const result = new ForceReplyBuilder().makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        force_reply: true,
        input_field_placeholder: undefined,
        selective: undefined,
      },
    });
  });

  test('должен создать объект reply_markup с правильным placeholder', () => {
    const placeholder = 'Введите текст';
    const result = new ForceReplyBuilder().setPlaceholder(placeholder).makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        force_reply: true,
        input_field_placeholder: placeholder,
        selective: undefined,
      },
    });
  });

  test('должен создать объект reply_markup с правильным selective', () => {
    const result = new ForceReplyBuilder().setSelective(true).makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        force_reply: true,
        input_field_placeholder: undefined,
        selective: true,
      },
    });
  });
});
