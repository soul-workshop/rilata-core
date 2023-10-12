import { describe, expect, test } from 'bun:test';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { GetFieldValidatorDataType } from '../../../../src/domain/validator/field-validator/types';
import { LiteralDataType } from '../../../../src/domain/validator/rules/types';
import { TrimStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim';
import { TrimEndStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim-end.l-rule';
import { TrimStartStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim-start.l-rule';
import { MaxCharsCountValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';
import { MinCharsCountValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/min-chars-count.v-rule';
import { CannotBeEmptyStringValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-empty-string.a-rule';
import { UUIDFormatValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { CannotBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-undefined.a-rule';
import { CanBeNullValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-null.n-rule';
import { CanBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-undefined.n-rule';
import { CannotBeNullValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-null.a-rule';
import { ValidationRule } from '../../../../src/domain/validator/rules/validation-rule';

describe('Валидированное значение обязательно', () => {
  const types: [GetFieldValidatorDataType<LiteralDataType>, unknown][] = [
    ['number', 5],
    ['string', 't'],
    ['boolean', false],
  ];

  types.forEach(([dataType, dataValue]) => {
    test('Успех, на валидацию пришло явное значение', () => {
      const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, dataType, []);
      const result = sut.validate(dataValue);
      expect(result.isSuccess()).toBe(true);
    });

    test('Провал, пришло undefined или null', () => {
      const nullValues = [undefined, null];
      const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, dataType, []);
      nullValues.forEach((value) => {
        const result = sut.validate(value);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          fieldName: [
            {
              text: 'Значение не должно быть undefined или null',
              hint: {},
            },
          ],
        });
      });
    });
  });

  test('Провал, пришло пустая строка', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'number', []);
    const result = sut.validate('');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          hint: {},
          text: 'Значение должно быть числовым',
        },
      ],
    });
  });

  test('Провал, пришло пустая строка', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'string', []);
    const result = sut.validate('');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          hint: {},
          text: 'Сротка обязательна к заполнению',
        },
      ],
    });
  });

  test('Провал, пришло пустая строка', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'boolean', []);
    const result = sut.validate('');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          hint: {},
          text: 'Значение должно быть булевым',
        },
      ],
    });
  });

  test('Успех сработало приведение значения lead-rule', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)], [new TrimEndStringLeadRule()]);
    const result = sut.validate('Absolute   ');
    expect(result.isSuccess()).toBe(true);
  });

  test('Успех сработало приведение значения двух lead-rule', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)], [new TrimStartStringLeadRule(), new TrimEndStringLeadRule()]);
    const values = ['Absolute  ', '  Absolute', ' Absolute  '];
    values.forEach((value) => {
      const result = sut.validate(value);
      expect(result.isSuccess()).toBe(true);
    });
  });

  test('Провал, пришло не валидное значение', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)]);
    const values = ['Absolute ', 'Absolute  '];
    values.forEach((value) => {
      const result = sut.validate(value);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Длина строки должна быть не больше {{maxCount}}',
            hint: {
              maxCount: 8,
            },
          },
        ],
      });
    });
  });

  test('Провал, пришло не валидное значение', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'string', [new MinCharsCountValidationRule(3)]);
    const result = sut.validate('AG');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Строка должна быть не меньше {{minCount}}',
          hint: {
            minCount: 3,
          },
        },
      ],
    });
  });

  test('Провал, пришло не валидное значение для нескольких правил', () => {
    const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'string', [new MinCharsCountValidationRule(8), new UUIDFormatValidationRule()]);
    const result = sut.validate('550e8400-e29b-41d4-a716-44665544000');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Значение должно соответствовать формату UUID',
          hint: {},
        },
      ],
    });
  });

  describe('Получаемое значение может быть null но не может быть undefined', () => {
    class CannotbeUndefinedCanbeNull extends LiteralFieldValidator<'fieldName', true, false, string> {
      protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
        return [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()];
      }
    }

    const sut = new CannotbeUndefinedCanbeNull(
      'fieldName',
      true,
      { isArray: false },
      'string',
      [
        new MaxCharsCountValidationRule(8),
      ],
    );
    test('Успех, пришло валидное значение', () => {
      const result = sut.validate('Absolute');
      expect(result.isSuccess()).toBe(true);
    });
    test('Успех, пришло null', () => {
      const result = sut.validate(null);
      expect(result.isSuccess()).toBe(true);
    });
    test('Провал, пришло не валидное значение', () => {
      const result = sut.validate('Absolute??');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Длина строки должна быть не больше {{maxCount}}',
            hint: { maxCount: 8 },
          },
        ],
      });
    });
    test('Провал, пришло undefined', () => {
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Значение не должно быть undefined',
            hint: {},
          },
        ],
      });
    });
  });

  describe('Получаем Infinity и NaN', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'number', []);
    const infinityValues = [-Infinity, Infinity];
    infinityValues.forEach((value) => {
      test('Провал, пришло Infinity', () => {
        const result = sut.validate(value);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          fieldName: [
            {
              text: 'Значение не может быть Infinity или -Infinity',
              hint: {},
            },
          ],
        });
      });
    });

    test('Провал, пришло NaN', () => {
      const sut = new LiteralFieldValidator('fieldName', true, { isArray: false }, 'number', []);
      const result = sut.validate(NaN);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Значение не может быть NaN',
            hint: {},
          },
        ],
      });
    });
  });
});

describe('Валидированное значение необязательно', () => {
  const types: [GetFieldValidatorDataType<LiteralDataType>, unknown][] = [
    ['number', 5],
    ['string', 't'],
    ['boolean', false],
  ];
  types.forEach(([dataType, dataValue]) => {
    test('Успех, на валидацию пришло валидное значение', () => {
      const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, dataType, []);
      const result = sut.validate(dataValue);
      expect(result.isSuccess()).toBe(true);
    });

    test('Провал, пришло undefined или null', () => {
      const nullValues = [undefined, null];
      const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, dataType, []);
      nullValues.forEach((value) => {
        const result = sut.validate(value);
        expect(result.isSuccess()).toBe(true);
      });
    });
  });
  test('Провал, пришло пустая строка', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'number', []);
    const result = sut.validate('');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Значение должно быть числовым',
          hint: {},
        },
      ],
    });
  });
  test('Провал, пришло пустая строка', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'string', []);
    const result = sut.validate('');
    expect(result.isSuccess()).toBe(true);
  });
  test('Провал, пришло пустая строка', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'boolean', []);
    const result = sut.validate('');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Значение должно быть булевым',
          hint: {},
        },
      ],
    });
  });
  test('Успех сработало приведение значения lead-rule', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)], [new TrimStringLeadRule()]);
    const result = sut.validate('  Absolute  ');
    expect(result.isSuccess()).toBe(true);
  });
  test('Успех сработало приведение значения двух lead-rule', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)], [new TrimStartStringLeadRule(), new TrimEndStringLeadRule()]);
    const values = ['Absolute  ', '  Absolute', ' Absolute  '];
    values.forEach((value) => {
      const result = sut.validate(value);
      expect(result.isSuccess()).toBe(true);
    });
  });
  test('Провал, пришло не валидное значение', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)]);
    const value = 'Absolute?';
    const result = sut.validate(value);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Длина строки должна быть не больше {{maxCount}}',
          hint: {
            maxCount: 8,
          },
        },
      ],
    });
  });
  test('Провал, пришло не валидное значение для нескольких правил', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8), new UUIDFormatValidationRule()]);
    const result = sut.validate('Absolute??');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Длина строки должна быть не больше {{maxCount}}',
          hint: {
            maxCount: 8,
          },
        }, {
          text: 'Значение должно соответствовать формату UUID',
          hint: {},
        },
      ],
    });
  });
  test('Провал, пришло не валидное значение для нескольких правил', () => {
    const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'string', [new MinCharsCountValidationRule(9), new UUIDFormatValidationRule()]);
    const result = sut.validate('Absolute');
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      fieldName: [
        {
          text: 'Строка должна быть не меньше {{minCount}}',
          hint: {
            minCount: 9,
          },
        }, {
          text: 'Значение должно соответствовать формату UUID',
          hint: {},
        },
      ],
    });
  });

  describe('Значение не может быть undefined', () => {
    class CannotbeUndefinedCanbeNull extends LiteralFieldValidator<'fieldName', false, false, string> {
      protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
        return [new CanBeUndefinedValidationRule(), new CannotBeNullValidationRule()];
      }
    }

    const sut = new CannotbeUndefinedCanbeNull(
      'fieldName',
      false,
      { isArray: false },
      'string',
      [
        new MaxCharsCountValidationRule(8),
      ],
    );
    test('успех, пришло валидное значение', () => {
      const result = sut.validate('Absolute');
      expect(result.isSuccess()).toBe(true);
    });
    test('успех, пришло undefined', () => {
      const result = sut.validate(undefined);
      expect(result.isSuccess()).toBe(true);
    });
    test('провал, пришло не валидное значение', () => {
      const result = sut.validate('Absolutes');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Длина строки должна быть не больше {{maxCount}}',
            hint: { maxCount: 8 },
          },
        ],
      });
    });
    test('Провал, пришло null', () => {
      const result = sut.validate(null);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Значение не может быть равным null',
            hint: {},
          },
        ],
      });
    });
  });

  describe('Получаем Infinity и NaN', () => {
    const values = [-Infinity, Infinity];
    values.forEach((value) => {
      test('Провал, пришло Infinity', () => {
        const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'number', []);
        const result = sut.validate(value);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          fieldName: [
            {
              text: 'Значение не может быть Infinity или -Infinity',
              hint: {},
            },
          ],
        });
      });
    });
    test('Провал, пришло NaN', () => {
      const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'number', []);
      const result = sut.validate(NaN);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: 'Значение не может быть NaN',
            hint: {},
          },
        ],
      });
    });
  });
});
