import { describe, expect, test } from 'bun:test';
import { TrimStartStringLeadRule } from '../../../../../../src/domain/validator/rules/lead-rules/string/trim-start.l-rule';

describe('TrimStartStringLeadRule test', () => {
  test('should trim leading characters correctly', () => {
    const rule = new TrimStartStringLeadRule(' \t');
    expect(rule.lead('  abc')).toBe('abc');
    expect(rule.lead('  \t123')).toBe('123');

    expect(rule.lead('abc  ')).toBe('abc  ');
    expect(rule.lead('123\t ')).toBe('123\t ');

    const customRule = new TrimStartStringLeadRule('xyz');
    expect(customRule.lead('xyzyz123')).toBe('123');
  });
});
