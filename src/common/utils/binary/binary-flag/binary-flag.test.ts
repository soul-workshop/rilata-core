import { describe, test, expect } from 'bun:test';
import { BinaryKeyFlag } from './binary-flag';

const loggerModes = {
  prod: 0b1,
  dev: 0b10,
  test: 0b100,
  info: 0b1000,
  warn: 0b10000,
};

describe('binary flags tests', () => {
  test('успех, ключ находится', () => {
    const sut = new BinaryKeyFlag(loggerModes, ['dev', 'info', 'warn']);
    expect(sut.isOn(['dev'])).toBe(true);
    expect(sut.isOn(['info'])).toBe(true);
    expect(sut.isOn(['warn'])).toBe(true);
    expect(sut.isOn(['warn', 'dev'])).toBe(true);
    expect(sut.isOn(['test', 'prod', 'info'])).toBe(true);
    expect(sut.isOn(['test', 'info', 'prod'])).toBe(true);
  });

  test('провал, ключ не находится', () => {
    const sut = new BinaryKeyFlag(loggerModes, ['dev', 'info', 'warn']);
    expect(sut.isOn(['test'])).toBe(false);
    expect(sut.isOn(['test', 'prod'])).toBe(false);
  });

  test('binary flags tests, off mode', () => {
    const sut = new BinaryKeyFlag(loggerModes, 'off');
    expect(sut.isOn(['dev'])).toBe(false);
    expect(sut.isOn(['info'])).toBe(false);
    expect(sut.isOn(['warn'])).toBe(false);
    expect(sut.isOn(['warn', 'dev'])).toBe(false);
    expect(sut.isOn(['test', 'prod', 'info'])).toBe(false);
    expect(sut.isOn(['test', 'info', 'prod'])).toBe(false);
    expect(sut.isOn(['test'])).toBe(false);
    expect(sut.isOn(['test', 'prod'])).toBe(false);
  });

  test('binary flags tests, all mode', () => {
    const sut = new BinaryKeyFlag(loggerModes, 'all');
    expect(sut.isOn(['dev'])).toBe(true);
    expect(sut.isOn(['info'])).toBe(true);
    expect(sut.isOn(['warn'])).toBe(true);
    expect(sut.isOn(['warn', 'dev'])).toBe(true);
    expect(sut.isOn(['test', 'prod', 'info'])).toBe(true);
    expect(sut.isOn(['test', 'info', 'prod'])).toBe(true);
    expect(sut.isOn(['test'])).toBe(true);
    expect(sut.isOn(['test', 'prod'])).toBe(true);
  });
});
