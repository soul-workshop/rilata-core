import { describe, expect, test } from 'bun:test';
import { RoundNumberLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/number/round-number';

describe('RoundNumberLeadRule', () => {
  test('should round a number to the specified decimal places', () => {
    const sut = new RoundNumberLeadRule(-2);
    expect(sut.lead(231415956.7887945)).toBe(23.141595678879);
  });
});
