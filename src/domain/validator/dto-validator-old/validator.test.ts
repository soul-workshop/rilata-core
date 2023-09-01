import { wholeValueValidationErrorKey } from '../constants';
import { optionalEmptyArrayMustBeUndefinedRule } from '../field-rules/default/can-be-empty.field-v-rule';
import { isArrayRuleExplanation } from '../field-rules/default/is-array.field-v-rule';
import { isRequiredRuleExplanation } from '../field-rules/default/is-required.field-v-rule';
import { maxArrayElementsCountRuleExplanation } from '../field-rules/default/max-array-elements-count.field-v-rule';
import { notNullRuleExplanation } from '../field-rules/default/not-null.field-v-rule';
import { notSpecifiedDTOArrayAttrsRuleExplanation } from '../field-rules/default/not-specified-dto-attrs.field-v-rule';
import { isNumberRuleExplanation } from '../field-rules/default/type/is-number.field-v-rule';
import { isStringArrayRuleExplanation } from '../field-rules/default/type/is-string-array.field-v-rule';
import { isStringRuleExplanation } from '../field-rules/default/type/is-string.field-v-rule';
import { MaxNumberValidationRule, maxNumberRuleExplanation } from '../field-rules/prepared/numbers-related/max-number.field-v-rule';
import { EmailFormatValidationRule } from '../field-rules/prepared/strings-related/email-format.field-v-rule';
import { maxCharsCountRuleExplanation, MaxCharsCountValidationRule } from '../field-rules/prepared/strings-related/max-chars-count.field-v-rule';
import { minCharsCountRuleExplanation, MinCharsCountValidationRule } from '../field-rules/prepared/strings-related/min-chars-count.field-v-rule';
import { DTOFieldValidator } from '../field-validator/dto.field-validator';
import { LiteralFieldValidator } from '../field-validator/literal.field-validator';
import { NumberFieldValidator } from '../field-validator/number-field-validator';
import { GeneralValidationError } from '../types';
import { ValidatorMap } from './types';
import { nonValidatableValueRule, Validator } from './validator';

describe('Тестирование валидатора', () => {
  describe('Тестирование валидации литерального значения', () => {
    type ValidatableLiteral = number;
    const maxNumber = 10;

    class LiteralValidator extends Validator<ValidatableLiteral> {
      validatorMap = new NumberFieldValidator({
        isRequired: true,
        arrayConfig: {
          isArray: false,
        },
        typeConfig: {
          type: 'number',
        },
        rules: [
          new MaxNumberValidationRule(maxNumber),
        ],
      });
    }

    test('Валидация литерала: успех', () => {
      const validator = new LiteralValidator();
      const result = validator.validate(5);
      expect(result.isSuccess()).toBeTruthy();
    });

    test('Валидация литерала: ошибка валидации всего объекта: нарушено правило', () => {
      const validator = new LiteralValidator();
      const result = validator.validate(15);
      expect(result.isFailure()).toBeTruthy();
      if (result.isFailure()) {
        expect((result.value as GeneralValidationError).attrs).toEqual({
          [wholeValueValidationErrorKey]: [{
            validationErrorName: maxNumberRuleExplanation,
            validationErrorHint: [{ maxNumber }],
          }],
        });
      }
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: maxNumberRuleExplanation,
          validationErrorHint: [{ maxNumber }],
        }],
      });
    });

    test('Валидация литерала: ошибка валидации всего объекта: неверный тип', () => {
      const validator = new LiteralValidator();
      const result = validator.validate('some string' as unknown as number);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: isNumberRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });
  });

  describe('Тестирование валидации массива литеральных значений', () => {
    type ValidatableLiteralArray = string[];
    const minChars = 5;

    class LiteralArrayValidator extends Validator<ValidatableLiteralArray> {
      validatorMap = new LiteralFieldValidator({
        isRequired: true,
        arrayConfig: {
          isArray: true,
        },
        typeConfig: {
          type: 'string',
        },
        rules: [
          new MinCharsCountValidationRule(minChars),
        ],
      });
    }

    test('Успех', () => {
      const validator = new LiteralArrayValidator();

      const result = validator.validate(['super', 'puper-duper']);
      expect(result.isSuccess()).toBeTruthy();
    });

    test('Ошибка валидации всего объекта: не массив', () => {
      const validator = new LiteralArrayValidator();
      const result = validator.validate('some string' as unknown as ValidatableLiteralArray);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: isArrayRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации всего объекта: не только строки в массиве', () => {
      const validator = new LiteralArrayValidator();
      const result = validator.validate(['super', 5 as unknown as string]);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: isStringArrayRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации всего объекта: смесь литералов и DTO', () => {
      const validator = new LiteralArrayValidator();
      const result = validator.validate(['super', { age: 'thirteen' } as unknown as string]);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: nonValidatableValueRule,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации: превышено максимальное число элементов массива', () => {
      type ValidatableLiteralCountArray = string[];
      const maxElementsCount = 2;

      class LiteralCountArrayValidator extends Validator<ValidatableLiteralCountArray> {
        validatorMap = new LiteralFieldValidator({
          isRequired: true,
          arrayConfig: {
            isArray: true,
            maxElementsCount,
          },
          typeConfig: {
            type: 'string',
          },
          rules: [],
        });
      }

      const validator = new LiteralCountArrayValidator();
      const result = validator.validate(['a', 'b', 'c']);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: maxArrayElementsCountRuleExplanation,
          validationErrorHint: [{ maxElementsCount }],
        }],
      });
    });

    test('Ошибка валидации: нарушено правило некоторых элементов', () => {
      const validator = new LiteralArrayValidator();
      const result = validator.validate(['normal long string', 'sh', 'more normal', 'sh2']);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        1: [{
          validationErrorName: minCharsCountRuleExplanation,
          validationErrorHint: [
            { minCharsCount: minChars },
          ],
        }],
        3: [{
          validationErrorName: minCharsCountRuleExplanation,
          validationErrorHint: [
            { minCharsCount: minChars },
          ],
        }],
      });
    });

    test('Ошибка валидации: для массива нужен минимум 1 элемент', () => {
      const validator = new LiteralArrayValidator();
      const result = validator.validate([]);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: isRequiredRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });
  });

  describe('Тестирование валидации DTO', () => {
    test('Успех', () => {
      type AddPersonCommand = {
        realName: string,
        nickname?: string,
        phone: { number: string },
        emails: string[],
        cars: Array<{
          licensePlate: string,
          brand: {
            name: string,
            canFly?: boolean,
          },
        }>,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              nickname: new LiteralFieldValidator({
                isRequired: false,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              phone: new DTOFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    number: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                  },
                },
              }),
              emails: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: true },
                typeConfig: { type: 'string' },
                rules: [new EmailFormatValidationRule()],
              }),
              cars: new DTOFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: true },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    licensePlate: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                    brand: new DTOFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: {
                        type: 'dto',
                        validatorMap: {
                          name: new LiteralFieldValidator({
                            isRequired: true,
                            arrayConfig: { isArray: false },
                            typeConfig: { type: 'string' },
                            rules: [],
                          }),
                          canFly: new LiteralFieldValidator({
                            isRequired: false,
                            arrayConfig: { isArray: false },
                            typeConfig: { type: 'boolean' },
                            rules: [],
                          }),
                        },
                      },
                    }),
                  },
                },
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        realName: 'Jason',
        nickname: 'Butterfly',
        phone: { number: '8 777 777 77 77' },
        emails: ['jason@gmail.com', 'jason2@gmail.com'],
        cars: [
          {
            licensePlate: 'R 150 RKA',
            brand: {
              name: 'VAZ',
              canFly: false,
            },
          },
          {
            licensePlate: 'R 001 BMW',
            brand: {
              name: 'Tesla',
              canFly: true,
            },
          },
        ],
      };
      const result = validator.validate(command);
      expect(result.isSuccess()).toBeTruthy();
    });

    test('Ошибка валидации: нарушено правило для поля', () => {
      const minCharsCount = 5;

      type AddPersonCommand = {
        realName: string,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [new MinCharsCountValidationRule(minCharsCount)],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command = {
        realName: 'four',
      };
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        realName: [{
          validationErrorName: minCharsCountRuleExplanation,
          validationErrorHint: [
            { minCharsCount },
          ],
        }],
      });
    });

    test('Ошибка валидации: поле имеет неверный тип', () => {
      type AddPersonCommand = {
        realName: string,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        realName: 5 as unknown as string,
      };
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        realName: [{
          validationErrorName: isStringRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации: значения null поля недопустимо', () => {
      type AddPersonCommand = {
        realName: string,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        realName: null as unknown as string,
      };
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        realName: [{
          validationErrorName: notNullRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации: значение поля обязательно', () => {
      type AddPersonCommand = {
        realName: string,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command = {
      } as AddPersonCommand;
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        realName: [{
          validationErrorName: isRequiredRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации: необязательное поле-массив не может быть пустым массивом, '
      + 'должно быть undefined', () => {
        type AddPersonCommand = {
          realName: string,
          emails?: Array<string>,
        };

        class DTOValidator extends Validator<AddPersonCommand> {
          validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
            isRequired: true,
            arrayConfig: { isArray: false },
            typeConfig: {
              type: 'dto',
              validatorMap: {
                realName: new LiteralFieldValidator({
                  isRequired: true,
                  arrayConfig: { isArray: false },
                  typeConfig: { type: 'string' },
                  rules: [],
                }),
                emails: new LiteralFieldValidator({
                  isRequired: false,
                  arrayConfig: { isArray: true },
                  typeConfig: { type: 'string' },
                  rules: [],
                }),
              },
            },
          });
        }

        const validator = new DTOValidator();
        const command: AddPersonCommand = {
          realName: 'Jason',
          emails: [],
        };
        const result = validator.validate(command);
        expect(result.isFailure()).toBeTruthy();
        expect((result.value as GeneralValidationError).attrs).toEqual({
          emails: [{
            validationErrorName: optionalEmptyArrayMustBeUndefinedRule,
            validationErrorHint: [],
          }],
        });

        const commandWithUndefined: AddPersonCommand = {
          realName: 'Jason',
          emails: undefined,
        };
        const resultWithUndefined = validator.validate(commandWithUndefined);
        expect(resultWithUndefined.isSuccess()).toBeTruthy();

        const commandWithoutEmail: AddPersonCommand = {
          realName: 'Jason',
        };
        const resultWithoutEmail = validator.validate(commandWithoutEmail);
        expect(resultWithoutEmail.isSuccess()).toBeTruthy();
    });

    test('Значение поля необязательно, поле отсутствует, '
        + 'дальшеная валидация для этого поля не выполняется'
        + '(для вложеннных объектов в это поле)', () => {
      type AddPersonCommand = {
        realName: string,
        phone?: {
          number: string,
        },
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              phone: new DTOFieldValidator({
                isRequired: false,
                arrayConfig: { isArray: false },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    number: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                  },
                },
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        realName: 'Jason',
      };
      const result = validator.validate(command);
      expect(result.isSuccess()).toBeTruthy();
    });

    test('Для невалиданого переданного значения для необязательного поля '
      + 'возвращаются ошибки валидации', () => {
      type AddPersonCommand = {
        realName: string,
        phoneNumber?: string,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              phoneNumber: new LiteralFieldValidator({
                isRequired: false,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        realName: 'Jason',
        phoneNumber: 5 as unknown as string,
      };
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        phoneNumber: [{
          validationErrorName: isStringRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации: внутренний объект содержит отсутствующее в валидаторе поле (лишнее)', () => {
      type AddPersonCommand = {
        realName: string,
        phone: {
          number: string,
        }
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              phone: new DTOFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    number: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                  },
                },
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        realName: 'Jason',
        phone: {
          number: '8 777 777 77 77',
          someAttr: 5,
        },
      } as AddPersonCommand;
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        phone: [{
          validationErrorName: notSpecifiedDTOArrayAttrsRuleExplanation,
          validationErrorHint: [
            { permittedKeys: ['number'] },
            { forbiddenKeys: ['someAttr'] },
          ],
        }],
      });
    });

    test('Ошибка валидации: для обязательного поля-массива нужен минимум 1 элемент', () => {
      type AddPersonCommand = {
        emails: Array<string>,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              emails: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: true },
                typeConfig: { type: 'string' },
                rules: [],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        emails: [],
      };
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        emails: [{
          validationErrorName: isRequiredRuleExplanation,
          validationErrorHint: [],
        }],
      });
    });

    test('Ошибка валидации: превышено максимальное число элементов массива', () => {
      const maxElementsCount = 2;

      type AddPersonCommand = {
        emails: Array<string>,
      };

      class DTOValidator extends Validator<AddPersonCommand> {
        validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: false },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              emails: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: true, maxElementsCount },
                typeConfig: { type: 'string' },
                rules: [],
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonCommand = {
        emails: ['one', 'two', 'three'],
      };
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        emails: [{
          validationErrorName: maxArrayElementsCountRuleExplanation,
          validationErrorHint: [{ maxElementsCount }],
        }],
      });
    });

    test('Ошибка валидации: объект содержит '
        + 'отсутствующее в валидаторе поле (лишнее)', () => {
        type AddPersonCommand = {
          realName: string,
        };

        class DTOValidator extends Validator<AddPersonCommand> {
          validatorMap: ValidatorMap<AddPersonCommand> = new DTOFieldValidator({
            isRequired: true,
            arrayConfig: { isArray: false },
            typeConfig: {
              type: 'dto',
              validatorMap: {
                realName: new LiteralFieldValidator({
                  isRequired: true,
                  arrayConfig: { isArray: false },
                  typeConfig: { type: 'string' },
                  rules: [],
                }),
              },
            },
          });
        }

        const validator = new DTOValidator();
        const command = {
          realName: 'Jason',
          lastName: 'Zoppon',
        };
        const result = validator.validate(command);
        expect(result.isFailure()).toBeTruthy();
        expect((result.value as GeneralValidationError).attrs).toEqual({
          [wholeValueValidationErrorKey]: [{
            validationErrorName: notSpecifiedDTOArrayAttrsRuleExplanation,
            validationErrorHint: [
              { permittedKeys: ['realName'] },
              { forbiddenKeys: ['lastName'] },
            ],
          }],
        });
    });
  });

  describe('Тестирование массива DTO', () => {
    test('Успешная валидация', () => {
      type AddPersonsCommand = Array<{
        realName: string,
        phone: { number: string },
      }>;

      class DTOValidator extends Validator<AddPersonsCommand> {
        validatorMap: ValidatorMap<AddPersonsCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: true },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              phone: new DTOFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    number: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                  },
                },
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonsCommand = [
        {
          realName: 'Jason',
          phone: { number: '8 777 777 77 77' },
        },
        {
          realName: 'Lea',
          phone: { number: '8 777 777 77 88' },
        },
      ];
      const result = validator.validate(command);
      expect(result.isSuccess()).toBeTruthy();
    });

    test('Неуспешная валидация: ошибка всего объекта', () => {
      type AddPersonsCommand = Array<{
        realName: string,
        phone: { number: string },
      }>;
      const maxElementsCount = 1;

      class DTOValidator extends Validator<AddPersonsCommand> {
        validatorMap: ValidatorMap<AddPersonsCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: true, maxElementsCount },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [],
              }),
              phone: new DTOFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    number: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                  },
                },
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonsCommand = [
        {
          realName: 'Jason',
          phone: { number: '8 777 777 77 77' },
        },
        {
          realName: 'Lea',
          phone: { number: '8 777 777 77 88' },
        },
      ];
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: maxArrayElementsCountRuleExplanation,
          validationErrorHint: [{ maxElementsCount }],
        }],
      });
    });

    test('Неуспешная валидация: ошибка в одном из элементе', () => {
      type AddPersonsCommand = Array<{
        realName: string,
        phone: { number: string },
      }>;

      const minCharsCount = 5;

      class DTOValidator extends Validator<AddPersonsCommand> {
        validatorMap: ValidatorMap<AddPersonsCommand> = new DTOFieldValidator({
          isRequired: true,
          arrayConfig: { isArray: true },
          typeConfig: {
            type: 'dto',
            validatorMap: {
              realName: new LiteralFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: { type: 'string' },
                rules: [new MinCharsCountValidationRule(minCharsCount)],
              }),
              phone: new DTOFieldValidator({
                isRequired: true,
                arrayConfig: { isArray: false },
                typeConfig: {
                  type: 'dto',
                  validatorMap: {
                    number: new LiteralFieldValidator({
                      isRequired: true,
                      arrayConfig: { isArray: false },
                      typeConfig: { type: 'string' },
                      rules: [],
                    }),
                  },
                },
              }),
            },
          },
        });
      }

      const validator = new DTOValidator();
      const command: AddPersonsCommand = [
        {
          realName: 'Jason',
          phone: { number: '8 777 777 77 77' },
        },
        {
          realName: 'Lea',
          phone: { number: '8 777 777 77 88' },
        },
      ];
      const result = validator.validate(command);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        1: {
          realName: [{
            validationErrorName: minCharsCountRuleExplanation,
            validationErrorHint: [{ minCharsCount }],
          }],
        },
      });
    });
  });

  describe('Валидация чего-либо неподдерживаемого: ошибка NonValidatableValidationRule', () => {
    class TestValidator extends Validator<number> {
      validatorMap = new LiteralFieldValidator({
        isRequired: true,
        arrayConfig: {
          isArray: false,
        },
        typeConfig: {
          type: 'number',
        },
        rules: [],
      });
    }

    test('Успешное получение ошибки', () => {
      const validator = new TestValidator();
      const result = validator.validate(new Set([5]) as unknown as number);
      expect(result.isFailure()).toBeTruthy();
      expect((result.value as GeneralValidationError).attrs).toEqual({
        [wholeValueValidationErrorKey]: [{
          validationErrorName: nonValidatableValueRule,
          validationErrorHint: [],
        }],
      });
    });
  });

  describe('Нарушение нескольких правил валидации', () => {
    type ValidatableLiteralArray = string[];
    const minChars = 5;
    const maxChars = 3;

    class LiteralArrayValidator extends Validator<ValidatableLiteralArray> {
      validatorMap = new LiteralFieldValidator({
        isRequired: true,
        arrayConfig: {
          isArray: true,
        },
        typeConfig: {
          type: 'string',
        },
        rules: [
          new MinCharsCountValidationRule(minChars),
          new MaxCharsCountValidationRule(maxChars),
        ],
      });
    }

    test('Нарушено 2 правила', () => {
      const validator = new LiteralArrayValidator();
      const result = validator.validate(['four']);
      expect((result.value as GeneralValidationError).attrs).toEqual({
        0: [
          {
            validationErrorName: minCharsCountRuleExplanation,
            validationErrorHint: [
              { minCharsCount: minChars },
            ],
          },
          {
            validationErrorName: maxCharsCountRuleExplanation,
            validationErrorHint: [
              { maxCharsCount: maxChars },
            ],
          },
        ],
      });
    });
  });
});
