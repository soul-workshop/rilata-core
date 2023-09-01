import { LetaralFieldValidator } from '../../validator/field-validator/field-validator';
import { MaxNumberValidationRule } from '../../validator/rules/validate-rules/number/max-number.v-rule';
import { MinNumberValidationRule } from '../../validator/rules/validate-rules/number/min-number.v-rule';

describe('number validator with max value', () => {
  const MIN_AGE = 18;

  const MAN_MAX_AGE = 65;

  const WOMANAX_AGE = 63;

  class PersonIsWorkAgeFieldValidator extends LetaralFieldValidator<true, false, number> {
    protected dataType: 'number' = 'number';

    constructor(personSex: 'man' | 'woman') {
      super(true, { isArray: false }, [
        new MaxNumberValidationRule(personSex === 'man' ? MAN_MAX_AGE : WOMANAX_AGE),
        new MinNumberValidationRule(MIN_AGE),
      ]);
    }
  }
  const sut = new PersonIsWorkAgeFieldValidator('man');

  test('success case', () => {
    const answer = sut.validate(25);
    expect(answer.isValidValue).toBe(true);
  });

  test('fail, value less a min requirement', () => {
    const result = sut.validate(15);
    expect(result.isValidValue).toBe(false);
    expect(result.errors).toEqual([{
      requirement: 'Число должно быть больше или равно {{min}}',
      ruleHint: { min: 18 },
    }]);
    expect(result.arrErrors).toBe(undefined);
  });

  test('fail, value is required', () => {
    let age;
    const result = sut.validate(age);
    expect(result.isValidValue).toBe(false);
    expect(result.errors).toEqual([{
      requirement: 'Значение не должно быть undefined или null',
      ruleHint: {},
    }]);
  });
});
