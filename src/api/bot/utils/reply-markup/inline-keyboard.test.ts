import { describe, test, expect } from 'bun:test';
import { InlineKeyboardBuilder } from './inline-keyboard.js';

describe('InlineKeyboard', () => {
  test('должен создать InlineKeyboardMarkup с пустыми строками', () => {
    const result = new InlineKeyboardBuilder().makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        inline_keyboard: [],
      },
    });
  });

  test('должен добавить одну строку с кнопкой callback', () => {
    const buttonText = 'Кнопка 1';
    const callbackData = 'callback_1';
    const result = new InlineKeyboardBuilder()
      .addCbButtonRow(buttonText, callbackData)
      .makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        inline_keyboard: [[{ text: buttonText, callback_data: callbackData }]],
      },
    });
  });

  test('должен добавить несколько строк с кнопками callback', () => {
    const buttonText1 = 'Кнопка 1';
    const callbackData1 = 'callback_1';
    const buttonText2 = 'Кнопка 2';
    const callbackData2 = 'callback_2';
    const buttonText3 = 'Кнопка 3';
    const callbackData3 = 'callback_3';
    const result = new InlineKeyboardBuilder()
      .addCbButtonRow(buttonText1, callbackData1)
      .addCbButtonRow(
        buttonText2, callbackData2, buttonText3, callbackData3,
      )
      .makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        inline_keyboard: [
          [{ text: buttonText1, callback_data: callbackData1 }],
          [
            { text: buttonText2, callback_data: callbackData2 },
            { text: buttonText3, callback_data: callbackData3 },
          ],
        ],
      },
    });
  });

  test('должен добавить несколько строк с кнопками callback через pushRow', () => {
    const buttonText1 = 'Кнопка 1';
    const callbackData1 = 'callback_1';
    const buttonText2 = 'Кнопка 2';
    const callbackData2 = 'callback_2';
    const buttonText3 = 'Кнопка 3';
    const callbackData3 = 'callback_3';
    const result = new InlineKeyboardBuilder()
      .addCbButtonRow(buttonText1, callbackData1)
      .pushRow([
        { text: buttonText2, callback_data: callbackData2 },
        { text: buttonText3, callback_data: callbackData3 },
      ])
      .makeReplyMarkup();
    expect(result).toEqual({
      reply_markup: {
        inline_keyboard: [
          [{ text: buttonText1, callback_data: callbackData1 }],
          [
            { text: buttonText2, callback_data: callbackData2 },
            { text: buttonText3, callback_data: callbackData3 },
          ],
        ],
      },
    });
  });

  test('должен создать объект inline_reply_markup с кнопками callback', () => {
    const buttonText = 'Кнопка';
    const callbackData = 'callback_data';
    const result = new InlineKeyboardBuilder()
      .addCbButtonRow(buttonText, callbackData)
      .make();
    expect(result).toEqual({
      inline_keyboard: [
        [{ text: buttonText, callback_data: callbackData }],
      ],
    });
  });

  test('добавление кнопок с непарным количеством аргументов вызывает ошибку', () => {
    const buttonText1 = 'Кнопка 1';
    const callbackData1 = 'callback_1';
    const buttonText2 = 'Кнопка 2';
    try {
      new InlineKeyboardBuilder()
        .addCbButtonRow(buttonText1, callbackData1, buttonText2)
        .makeReplyMarkup();
      throw Error('not be throwed');
    } catch (e) {
      expect(String(e)).toContain('Не парный вызов аргументов:');
    }
  });
});
