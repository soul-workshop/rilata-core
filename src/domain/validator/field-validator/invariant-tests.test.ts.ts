/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable function-paren-newline */
import { describe, expect, test } from 'bun:test';
import { LiteralFieldValidator } from './literal-field-validator.ts';
import { StringChoiceValidationRule } from '../rules/validate-rules/string/string-choice.v-rule.ts';
import { DtoFieldValidator } from './dto-field-validator.ts';
import { FieldValidatorPrivateFixtures } from './test-fixtures.ts';

describe('проверки неправильной конфигурации массива для LiteralFieldValidator', () => {
  test('максимальное количество элементов меньше, чем минимальное количество элементов', () => {
    const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
    const callback = () => (
      new LiteralFieldValidator(
        'roles', true, { isArray: true, maxElementsCount: 1, minElementsCount: 2 }, 'string', [new StringChoiceValidationRule(roles)],
      )
    );
    expect(callback).toThrow('not valid arrayConfig: min=2, max=1');
  });

  test('минимальное количество элементов меньше 0', () => {
    const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
    const callback = () => (
      new LiteralFieldValidator(
        'roles', true, { isArray: true, minElementsCount: -1 }, 'string', [new StringChoiceValidationRule(roles)],
      )
    );
    expect(callback).toThrow('not valid arrayConfig: min=-1, max=undefined');
  });

  test('максимальное количество элементов меньше 0', () => {
    const roles = ['admin', 'staffManager', 'officeChieff', 'saleManager'];
    const callback = () => (
      new LiteralFieldValidator(
        'roles', true, { isArray: true, maxElementsCount: -1 }, 'string', [new StringChoiceValidationRule(roles)],
      )
    );
    expect(callback).toThrow('not valid arrayConfig: min=undefined, max=-1');
  });
});

describe('проверки неправильной конфигурации массива для DtoFieldValidator', () => {
  test('максимальное количество элементов меньше, чем минимальное количество элементов', () => {
    const callback = () => (
      new DtoFieldValidator('phones', true, { isArray: true, maxElementsCount: 1, minElementsCount: 2 }, 'dto', FieldValidatorPrivateFixtures.phoneAttrsValidatorMap,
      ));
    expect(callback).toThrow('not valid arrayConfig: min=2, max=1');
  });

  test('минимальное количество элементов меньше 0', () => {
    const callback = () => (
      new DtoFieldValidator('phones', true, { isArray: true, minElementsCount: -1 }, 'dto', FieldValidatorPrivateFixtures.phoneAttrsValidatorMap,
      ));
    expect(callback).toThrow('not valid arrayConfig: min=-1, max=undefined');
  });

  test('максимальное количество элементов меньше 0', () => {
    const callback = () => (
      new DtoFieldValidator('phones', true, { isArray: true, maxElementsCount: -1 }, 'dto', FieldValidatorPrivateFixtures.phoneAttrsValidatorMap,
      ));
    expect(callback).toThrow('not valid arrayConfig: min=undefined, max=-1');
  });
});
