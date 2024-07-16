import { describe, test, expect } from 'bun:test';
import { messageUtils } from './message.ts';

const updates = await Bun.file(`${import.meta.dir}/update-fixtures.json`).json();

describe('telegram bot message utility tests', () => {
  test('isTextMessage returns true for text message', () => {
    const { message } = updates[0];
    expect(messageUtils.isTextMessage(message)).toBe(true);
  });

  test('isTextMessage returns false for non-text message', () => {
    const { message } = updates[5]; // message with document
    expect(messageUtils.isTextMessage(message)).toBe(false);
  });

  test('isCommand returns true for message with bot command', () => {
    const { message } = updates[1]; // message with /start command
    expect(messageUtils.isCommand(message)).toBe(true);
  });

  test('isCommand returns false for message without bot command', () => {
    const { message } = updates[0]; // message without command
    expect(messageUtils.isCommand(message)).toBe(false);
  });

  test('hasCommand returns true for message with specific command', () => {
    const { message } = updates[2]; // message with /cancel command
    const command = '/cancel';
    expect(messageUtils.hasCommand(message, command)).toBe(true);
  });

  test('hasCommand returns false for message without specific command', () => {
    const { message } = updates[1]; // message with /start command
    const command = '/cancel';
    expect(messageUtils.hasCommand(message, command)).toBe(false);
  });

  // Тесты используют методы entityUtils, убедитесь, что entityUtils протестированы отдельно
});
