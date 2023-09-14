import { describe, expect, test } from 'bun:test';
import { UUIDFormatValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';

describe('Value must match the UUID format', () => {
  test('success, test with correct uuid', () => {
    const uuid = 'd092833c-4bc7-405d-976e-912511fa85e3';
    const sut = new UUIDFormatValidationRule();
    const result = sut.validate(uuid);
    expect(result).toEqual({
      behaviour: 'RunNextRule',
    });
  });
  test('test with wrong uuid', () => {
    const uuid = 'd09233c-4c7-405d-976e-9125fa85e3';
    const sut = new UUIDFormatValidationRule();
    const result = sut.validate(uuid);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение должно соответствовать формату UUID',
      },
    });
  });
});
