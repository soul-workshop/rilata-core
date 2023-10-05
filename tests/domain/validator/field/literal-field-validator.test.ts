import { describe, expect, test } from 'bun:test';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { GetFieldValidatorDataType } from '../../../../src/domain/validator/field-validator/types';
import { LiteralDataType } from '../../../../src/domain/validator/rules/types';
import { FieldValidatorPrivateFixtures, FieldValidatorTestMocksPrivateFixtures } from './test-fixtures';
import { TrimStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim';
import { TrimEndStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim-end.l-rule';
import { TrimStartStringLeadRule } from '../../../../src/domain/validator/rules/lead-rules/string/trim-start.l-rule';
import { MaxCharsCountValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';
import { MinCharsCountValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/min-chars-count.v-rule';
import { CannotBeEmptyStringValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-empty-string.a-rule';
import { UUIDFormatValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { CannotBeUndefinedValidationRule } from '../../../../src/domain/validator/rules/assert-rules/cannot-be-undefined.a-rule';
import { CanBeNullValidationRule } from '../../../../src/domain/validator/rules/nullable-rules/can-be-only-null.n-rule';

describe('Валидированное значение обязательно', () => {
  const types: [GetFieldValidatorDataType<LiteralDataType>, unknown][] = [
    ['number', 5],
    ['string', 't'],
    ['boolean', false]
  ];
  
    types.forEach(([dataType, value]) => {
      test('Успех, на валидацию пришло явное значение', () => {
        const sut = new LiteralFieldValidator('fieldName', true, { isArray: false },dataType, []);
        const result = sut.validate(value);
        expect(result.isSuccess()).toBe(true);
      });

      test('Провал, пришло undefined или null', () => {
        const nullValues = [undefined, null];
        const sut = new LiteralFieldValidator('fieldName', true, { isArray: false },dataType, []);
        nullValues.forEach((value) => {
          const result = sut.validate(value);
          expect(result.isFailure()).toBe(true);
          expect(result.value).toEqual({
            fieldName: [
              {
                text: "Значение не должно быть undefined или null",
                hint: {}
              }
            ]
          });
        });
      });
    });
    
    test('Провал, пришло пустая строка', () => {
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false },'number', []);
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            hint: {},
            text: "Значение должно быть числовым"
          }
        ]
      });
    });

    test('Провал, пришло пустая строка', () => {
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false },'string', []);
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            hint: {},
            text: "Сротка обязательна к заполнению"
          }
        ]
      });
    });

    test('Провал, пришло пустая строка', () => {
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'boolean',[]);
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            hint: {},
            text: "Значение должно быть булевым"
          }
        ]
      });
    });

    test('Успех сработало приведение значения lead-rule',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)],[new TrimEndStringLeadRule()]);
      const result = sut.validate('Absolute   ');
      expect(result.isSuccess()).toBe(true);
    });

    test('Успех сработало приведение значения двух lead-rule',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)],[new TrimStartStringLeadRule(), new TrimEndStringLeadRule()]);
      const values = ['Absolute  ', '  Absolute', ' Absolute  '];
      values.forEach((value) => {
        const result = sut.validate(value);
      expect(result.isSuccess()).toBe(true);
      });
    });

    test('Провал, пришло не валидное значение',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)]);
      const values = ['Absolute ', 'Absolute  '];
      values.forEach((value) => {
        const result = sut.validate(value);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Длина строки должна быть не больше {{maxCount}}",
            hint: {
              maxCount: 8
            }
          }
        ]
      });
      });
    });

    test('Провал, пришло не валидное значение для нескольких правил',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new MinCharsCountValidationRule(3)]);
      const result = sut.validate('AG');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Строка должна быть не меньше {{minCount}}",
            hint: {
              minCount: 3
            }
          }
        ]
      });
    });

    test('Провал, пришло не валидное значение',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new UUIDFormatValidationRule()]);
      const result = sut.validate('550e8400-e29b-41d4-a716-44665544000');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение должно соответствовать формату UUID",
            hint: {}
          },
        ]
      });
    });

  describe('Получаем undefined или null',()=>{
    test('Успех, пришло валидное значение',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate('Absolute');
      expect(result.isSuccess()).toBe(true);
    });
    test('Провал, пришло undefined',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate(undefined);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение не должно быть undefined или null",
            hint: {}
          },
        ]
      });
    });
    test('Провал, пришло true',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate(true);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение должно быть строковым значением",
            hint: {}
          },
        ]
      });
    });
    test('Провал, пришло null',()=>{
      const sut = new LiteralFieldValidator('fieldName',  true, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate(null);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение не должно быть undefined или null",
            hint: {}
          },
        ]
      });
    });
  });

  describe('Получаем Infinity и NaN', () => {
    const infinityValues = [-Infinity, Infinity];
    infinityValues.forEach((value) => {
      test('Провал, пришло Infinity', () => {
        const sut = new LiteralFieldValidator('fieldName', false, { isArray: false }, 'number', []);
        const result = sut.validate(value);
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
          fieldName: [
            {
              text: "Значение не должно быть Infinity или -Infinity",
              hint: {}
            },
          ]
        });
      });
    });
    test('Провал, пришло NaN', () => {
      const sut = new LiteralFieldValidator('fieldName', true, { isArray: false },'number', []);
      const result = sut.validate(NaN);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение не должно быть NaN",
            hint: {}
          },
        ]
      });
    });
  });
});


  describe('Валидированное значение необязательно', () => {
    const types: [GetFieldValidatorDataType<LiteralDataType>, unknown][] = [
      ['number', 5],
      ['string', 't'],
      ['boolean', false]
    ];
    types.forEach(([dataType, value]) => {
      test('Успех, на валидацию пришло валидное значение', () => {
        const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, dataType,[]);
        const result = sut.validate(value);
        expect(result.isSuccess()).toBe(true);
      });

      test('Провал, пришло undefined или null', () => {
        const nullValues = [undefined, null];
        const sut = new LiteralFieldValidator('fieldName', false, { isArray: false },dataType,[]);
        nullValues.forEach((value) => {
          const result = sut.validate(value);
          expect(result.isSuccess()).toBe(true);
        });
      });
    });
    test('Провал, пришло пустая строка', () => {
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'number',[]);
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение должно быть числовым",
            hint: {}
          }
        ]
      });
    });
    test('Провал, пришло пустая строка', () => {
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string',[]);
      const result = sut.validate('');
      expect(result.isSuccess()).toBe(true);
    });
    test('Провал, пришло пустая строка', () => {
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false },'boolean', []);
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение должно быть булевым",
            hint: {}
          }
        ]
      });
    });

    const sut = new DtoFieldValidator('email', false, { isArray: false },'dto',  FieldValidatorPrivateFixtures.emailAttrsValidatorMap);
    const nullValues = [undefined, null];
    test('Провал, пришло undefined или null', () => {
      nullValues.forEach((value) => {
      const result = sut.validate(value);
      expect(result.isSuccess()).toBe(true);
    });
  });
    test('Провал, пришло пустая строка', () => {
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        ___whole_value_validation_error___:  [
          {
            text: "Значение должно быть объектом",
            hint: {}
          }
        ]
      }); 
    });
    test('Успех сработало приведение значения lead-rule',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)],[new TrimStringLeadRule()]);
      const result = sut.validate('  Absolute  ');
      expect(result.isSuccess()).toBe(true);
    });
    test('Успех сработало приведение значения двух lead-rule',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)],[new TrimStartStringLeadRule(), new TrimEndStringLeadRule()]);
      const values = ['Absolute  ', '  Absolute', ' Absolute  '];
      values.forEach((value) => {
        const result = sut.validate(value);
      expect(result.isSuccess()).toBe(true);
      });
    });
    test('Провал, пришло не валидное значение',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(8)]);
      const values = ['Absolute ', 'Absolute  '];
      values.forEach((value) => {
        const result = sut.validate(value);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Длина строки должна быть не больше {{maxCount}}",
            hint: {
              maxCount: 8
            }
          }
        ]
      });
      });
    });
    test('Провал, пришло не валидное значение для нескольких правил',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new MaxCharsCountValidationRule(1), new MinCharsCountValidationRule(3)]);
      const result = sut.validate('AG');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
          fieldName: [
            {
              text: "Длина строки должна быть не больше {{maxCount}}",
              hint: {
                maxCount: 1
              }
            }, {
              text: "Строка должна быть не меньше {{minCount}}",
              hint: {
                minCount: 3
              }
            }
          ]
      });
    });
    test('Провал, пришло не валидное значение для нескольких правил T',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new MinCharsCountValidationRule(3), new CannotBeEmptyStringValidationRule()]);
      const result = sut.validate('');
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Строка должна быть не меньше {{minCount}}",
            hint: {
              minCount: 3
            }
          }, {
            text: "Значение должно быть не пустой строкой",
            hint: {}
          }
        ]
      });
    });

  describe('Получаем null и undefined ',()=>{
    test('успех, пришло валидное значение',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate('Absolute');
      expect(result.isSuccess()).toBe(true);
    });
    test('успех, пришло undefined',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate(undefined);
      expect(result.isSuccess()).toBe(true);
    });
    test('провал, пришло не валидное значение',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate(true);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение должно быть строковым значением",
            hint: {}
          },
        ]
      });
    });
    test('успех, пришло null',()=>{
      const sut = new LiteralFieldValidator('fieldName',  false, { isArray: false }, 'string', [new CannotBeUndefinedValidationRule(), new CanBeNullValidationRule()]);
      const result = sut.validate(null);
      expect(result.isSuccess()).toBe(true);
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
              text: "Значение не должно быть Infinity или -Infinity",
              hint: {}
            },
          ]
        });
      });
    });
    test('Провал, пришло NaN', () => {
      const sut = new LiteralFieldValidator('fieldName', false, { isArray: false },'number', []);
      const result = sut.validate(NaN);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        fieldName: [
          {
            text: "Значение не должно быть NaN",
            hint: {}
          },
        ]
      });
    });
  });  
});
