import { describe, expect, test } from 'bun:test';
import { TrimStringLeadRule } from '../../../../../../src/domain/validator/rules/lead-rules/string/trim';

describe('TrimStringLeadRule', () => {
  test('should trim a string based on trimSymbols', () => {
    const trimSymbols = ' \t\v';
    const trimRule = new TrimStringLeadRule(trimSymbols);
    const inputString = '   This is a test string.   ';
    const expectedString = 'This is a test string.';
    const result = trimRule.lead(inputString);
    expect(result).toEqual(expectedString);
  });

  test('should not trim a string if trimSymbols are not present', () => {
    const trimSymbols = 'xyz';
    const trimRule = new TrimStringLeadRule(trimSymbols);
    const inputString = '   This is a test string.   ';
    const result = trimRule.lead(inputString);
    expect(result).toEqual(inputString);
  });
});
