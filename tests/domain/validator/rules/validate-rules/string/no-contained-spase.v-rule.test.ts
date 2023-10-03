import { describe, expect, test } from 'bun:test';
import { NoContanedSpaseValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/no-contained-space.v-rule';

describe('', () => {
  test('', () => {
    const sut = new NoContanedSpaseValidationRule();
    const result = sut.validate('dadadas');
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });
});
