import { describe, expect, test } from 'bun:test';
import { MathFloorLeadRule } from '../../../../../src/domain/validator/rules/lead-rules/number/math-floor.v-rule';

describe('MathFloorLeadRule', () => {
  test('should round down the number', () => {
    const sut = new MathFloorLeadRule();
    const result = sut.lead(5.8);
    expect(result).toEqual(5);
  });

  test('should round down negative numbers', () => {
    const sut = new MathFloorLeadRule();
    const result = sut.lead(-3.2);
    expect(result).toEqual(-4);
  });
});
