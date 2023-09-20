import { describe, expect, test } from 'bun:test';
import { RoundNumberLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/number/round-number';

describe('RoundNumberLeadRule tests', () => {
  test('should round a number to the specified decimal places', () => {
    const sut = new RoundNumberLeadRule(2);
    expect(sut.lead(23.143)).toBe(23.14);
  });
  test('should round a number to the specified decimal places', () => {
    const sut = new RoundNumberLeadRule(2);
    expect(sut.lead(-23.148)).toBe(-23.15);
  });
  test('should round a number to the specified decimal places', () => {
    const sut = new RoundNumberLeadRule(-2);
    expect(sut.lead(23232.1423128)).toBe(23200);
  });
  test('should round a number to the specified decimal places', () => {
    const sut = new RoundNumberLeadRule(-2);
    expect(sut.lead(-23232.142312)).toBe(-23200);
  });
});
