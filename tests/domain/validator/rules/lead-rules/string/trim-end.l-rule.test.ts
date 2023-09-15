import { describe, expect, test } from 'bun:test';
import { TrimEndStringLeadRule } from '../../../../../../src/domain/validator/rules/lead-rules/string/trim-end.l-rule';

describe('TrimEndStringLeadRule', () => {
  test('should trim end of string', () => {
    const trimSymbols = ' \t\v';
    const rule = new TrimEndStringLeadRule(trimSymbols);
    const input = '   Hello   ';
    const result = rule.lead(input);
    expect(result).toBe('   Hello');
  });

  test('should not trim if no trailing trim symbols', () => {
    const trimSymbols = ' \t\v';
    const rule = new TrimEndStringLeadRule(trimSymbols);
    const input = 'Hello';
    const result = rule.lead(input);
    expect(result).toBe('Hello');
  });

  test('should handle empty string', () => {
    const trimSymbols = ' \t\v';
    const rule = new TrimEndStringLeadRule(trimSymbols);
    const input = '';
    const result = rule.lead(input);
    expect(result).toBe('');
  });
});
