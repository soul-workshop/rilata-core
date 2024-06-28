import { describe, test, expect } from 'bun:test';
import { MessageEntity } from '@grammyjs/types';
import { entityUtils } from './entity.js';

const updates = await Bun.file(`${import.meta.dir}/update-fixtures.json`).json();

describe('telegram bot message utility tests', () => {
  test('getEntities returns entities of specified type', () => {
    const { message } = updates[3]; // message with multiple entities
    const type = 'bot_command';
    const expectedEntities: MessageEntity[] = [
      { offset: 34, length: 6, type },
      { offset: 45, length: 6, type },
    ];
    expect(entityUtils.getEntities(type, message.entities)).toEqual(expectedEntities);
  });

  test('getEntities returns empty array for message without entities', () => {
    const { message } = updates[0]; // message without entities
    const type = 'bot_command';
    expect(entityUtils.getEntities(type, message.entities)).toEqual([]);
  });

  test('getEntities returns empty array for undefined entities', () => {
    expect(entityUtils.getEntities('bot_command')).toEqual([]);
  });

  test('getEntityValues returns command values from message entities', () => {
    const messageText = updates[3].message.text; // message with multiple entities
    const { entities } = updates[3].message;
    const resultEntities = entityUtils.getEntities('bot_command', entities);
    const expectedValues = ['/start', '/about'];
    expect(entityUtils.getEntityValues(resultEntities, messageText)).toEqual(expectedValues);
  });

  test('getEntityValues returns empty array for empty entities', () => {
    const messageText = updates[0].message.text; // message without entities
    const entities: MessageEntity[] = [];
    expect(entityUtils.getEntityValues(entities, messageText)).toEqual([]);
  });

  test('getEntityValues handles empty message text', () => {
    const entities: MessageEntity[] = [{ offset: 0, length: 5, type: 'bot_command' }];
    expect(entityUtils.getEntityValues(entities, '')).toEqual([]);
  });

  test('getEntityValues filters out empty strings', () => {
    const messageText = 'text with entity.';
    const entities: MessageEntity[] = [{ offset: 10, length: 6, type: 'bold' }];
    expect(entityUtils.getEntityValues(entities, messageText)).toEqual(['entity']);
  });
});
