import { describe, expect, test } from 'bun:test';
import { IsTimeStampValidationRule } from '../../../../../../src/domain/validator/rules/validate-rules/timestamp/is-timestamp.v-rule';

describe('Value is a date', () => {
  test('success, the resulting value is a date', () => {
    const sut = new IsTimeStampValidationRule();
    const result = sut.validate(1694683538);
    expect(result).toEqual({
      behaviour: 'SuccessRunNextRule',
    });
  });
  test('failure, if the value is given as a negative number', () => {
    const sut = new IsTimeStampValidationRule();
    const result = sut.validate(-1694683538);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение не является датой',
      },
    });
  });
  test('failure, if given infinity as value', () => {
    const sut = new IsTimeStampValidationRule();
    const result = sut.validate(Infinity);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение не является датой',
      },
    });
  });
  test('failure, if given negative infinity as value', () => {
    const sut = new IsTimeStampValidationRule();
    const result = sut.validate(-Infinity);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение не является датой',
      },
    });
  });
  test('failure, the resulting value is Not a Number', () => {
    const sut = new IsTimeStampValidationRule();
    const result = sut.validate(NaN);
    expect(result).toEqual({
      behaviour: 'SaveErrorAndRunNextRule',
      ruleError: {
        hint: {},
        text: 'Значение не является датой',
      },
    });
  });
});
