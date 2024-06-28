import { describe, test, expect } from 'bun:test';
import { ReplyKeyboardBuilder } from './reply-keyboard.js';

describe('ReplyKeyboard', () => {
  test('должен создать ReplyKeyboardMarkup с пустыми строками и опциями', () => {
    const result = new ReplyKeyboardBuilder().makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        keyboard: [],
      },
    });
  });

  test('должен добавить одну строку с кнопкой', () => {
    const buttonText = 'Кнопка 1';
    const result = new ReplyKeyboardBuilder().addButtonRow(buttonText).makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        keyboard: [[{ text: buttonText }]],
      },
    });
  });

  test('должен добавить несколько строк с кнопками', () => {
    const buttonText1 = 'Кнопка 1';
    const buttonText2 = 'Кнопка 2';
    const buttonText3 = 'Кнопка 2';
    const result = new ReplyKeyboardBuilder()
      .addButtonRow(buttonText1)
      .pushRow([{ text: buttonText2 }, { text: buttonText3 }])
      .makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        keyboard: [
          [{ text: buttonText1 }],
          [{ text: buttonText2 }, { text: buttonText3 }],
        ],
      },
    });
  });

  test('должен установить опции клавиатуры', () => {
    const options = { resize_keyboard: true, one_time_keyboard: true };
    const result = new ReplyKeyboardBuilder().setOption(options).makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        keyboard: [],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  });

  test('должен создать объект reply_markup с кнопками и опциями', () => {
    const buttonText = 'Кнопка';
    const options = { resize_keyboard: true };
    const result = new ReplyKeyboardBuilder()
      .addButtonRow(buttonText)
      .setOption(options)
      .makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        keyboard: [[{ text: buttonText }]],
        resize_keyboard: true,
      },
    });
  });
});
