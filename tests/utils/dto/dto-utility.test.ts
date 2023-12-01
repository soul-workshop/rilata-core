import { describe, expect, test } from 'bun:test';
import { AssertionException } from '../../../src/common/types';
import { dtoUtility } from '../../../src/common/utils/dto/dto-utility';

const sut = dtoUtility;

describe('dtoUtility class', () => {
  describe('получение глубокой копии объекта', () => {
    const personDTO = {
      name: 'nur',
      phone: ['first number', 'second number'],
      wife: {
        name: 'samal',
        phone: ['mobile number'],
      },
    };

    test('возращается точная копия объекта', () => {
      const copiedObj = sut.deepCopy(personDTO);

      expect(copiedObj).toStrictEqual(personDTO);
      expect(copiedObj).not.toBe(personDTO);
    });
  });

  describe('получение объекта с новыми значениями', () => {
    const personDTO = {
      name: 'nur',
      phone: ['mobile number'],
      age: 42,
      sex: 'man',
    };

    test('необходимые атрибуты изменились, получилию копию объекта', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newValues = { age: 43, sex: '' };

      const newPersonDTO = sut.replaceAttrs(copiedPersonDTO, newValues);

      expect(newPersonDTO).not.toBe(copiedPersonDTO);

      expect(newPersonDTO.name).toBe(personDTO.name);
      expect(newPersonDTO.phone).toEqual(personDTO.phone);
      expect(newPersonDTO.age).toEqual(newValues.age);
      expect(newPersonDTO.sex).toEqual(newValues.sex);
    });

    test('необходимые атрибуты изменились, получили тот же объект', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newValues = { age: 43, sex: '' };

      const newPersonDTO = sut.replaceAttrs(copiedPersonDTO, newValues, false);

      expect(newPersonDTO).toBe(copiedPersonDTO);

      expect(newPersonDTO.name).toBe(personDTO.name);
      expect(newPersonDTO.phone).toEqual(personDTO.phone);
      expect(newPersonDTO.age).toEqual(newValues.age);
      expect(newPersonDTO.sex).toEqual(newValues.sex);
    });

    test('изменение изменяемых объектов (массива)', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const oldPhoneLink = copiedPersonDTO.phone;
      const newValues = { phone: ['new number of mobile'] };

      const newPersonDTO = sut.replaceAttrs(copiedPersonDTO, newValues);

      expect(newPersonDTO.name).toBe(personDTO.name);
      expect(newPersonDTO.age).toEqual(personDTO.age);
      expect(newPersonDTO.sex).toEqual(personDTO.sex);
      expect(newPersonDTO.phone).toStrictEqual(newValues.phone);
      expect(newPersonDTO.phone).not.toBe(oldPhoneLink);
    });

    test('не объявленные в personDTO атрибуты не добавляются', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newValues = { age: 51, sex: '', eyeColor: 'brown' };

      const newPersonDTO = sut.replaceAttrs(copiedPersonDTO, newValues);

      expect(newPersonDTO.name).toBe(personDTO.name);
      expect(newPersonDTO.phone).toStrictEqual(personDTO.phone);
      expect(newPersonDTO.age).toEqual(newValues.age);
      expect(newPersonDTO.sex).toEqual(newValues.sex);

      const recievedKeysSet = new Set(Object.keys(newPersonDTO));
      const expectKeysSet = new Set(['name', 'age', 'phone', 'sex']);
      expect(recievedKeysSet).toEqual(expectKeysSet);
    });

    test('переданный атрибут со значением undefined не копируется в возвращаемый объект', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newValues = { age: 43, sex: undefined };

      const newPersonDTO = sut.replaceAttrs(copiedPersonDTO, newValues);

      expect(newPersonDTO.name).toBe(personDTO.name);
      expect(newPersonDTO.phone).toEqual(personDTO.phone);
      expect(newPersonDTO.age).toEqual(newValues.age);
      expect(newPersonDTO.sex).toEqual(personDTO.sex);
    });
  });

  describe('тестирование расширения атрибутов DTO', () => {
    const personDTO = {
      firstName: 'nur',
      lastName: 'ama',
      age: 42,
    };

    test('атрибуты обновляются, получилию копию объекта', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newAttrs = { age: 43 };

      const newPersonDTO = sut.extendAttrs(copiedPersonDTO, newAttrs);

      expect(newPersonDTO).not.toBe(copiedPersonDTO);

      expect(newPersonDTO.firstName).toBe(personDTO.firstName);
      expect(newPersonDTO.lastName).toBe(personDTO.lastName);
      expect(newPersonDTO.age).toBe(newAttrs.age);
    });

    test('атрибуты обновляются, получилию тот же объект', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newAttrs = { age: 43 };

      const newPersonDTO = sut.extendAttrs(copiedPersonDTO, newAttrs, false);

      expect(newPersonDTO).toBe(copiedPersonDTO);

      expect(newPersonDTO.firstName).toBe(personDTO.firstName);
      expect(newPersonDTO.lastName).toBe(personDTO.lastName);
      expect(newPersonDTO.age).toBe(newAttrs.age);
    });

    test('новые атриубты добавляются в возвращаемый объект', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newAttrs = { sex: 'man', phone: ['first phone number'] };

      const newPersonDTO = sut.extendAttrs(copiedPersonDTO, newAttrs);

      expect(newPersonDTO.firstName).toBe(personDTO.firstName);
      expect(newPersonDTO.lastName).toBe(personDTO.lastName);
      expect(newPersonDTO.age).toBe(personDTO.age);
      expect(newPersonDTO.sex).toBe(newAttrs.sex);
      expect(newPersonDTO.phone).toBe(newAttrs.phone);
    });

    test('возвращается объект с типом второго объекта', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newValues = { age: '1 year' };

      const newPersonDTO = sut.extendAttrs(copiedPersonDTO, newValues);

      expect(newPersonDTO.firstName).toBe(personDTO.firstName);
      expect(newPersonDTO.lastName).toBe(personDTO.lastName);
      expect(newPersonDTO.age).toBe(newValues.age);
    });

    test('переданный атрибут со значением undefine копируется в возращаемое значение', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);
      const newValues = { age: undefined };

      const newPersonDTO = sut.extendAttrs(copiedPersonDTO, newValues);

      expect(newPersonDTO.firstName).toBe(personDTO.firstName);
      expect(newPersonDTO.lastName).toBe(personDTO.lastName);
      expect(newPersonDTO.age).toBe(undefined);
    });
  });

  describe('тестироваине удаления атрибутов объекта', () => {
    const personDTO = {
      firstName: 'nur',
      lastName: 'ama',
      age: 42,
    };

    test('убирается один атрибут, получили копию объекта', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);

      const newPersonDTO = sut.excludeAttrs(copiedPersonDTO, 'age');

      expect(newPersonDTO).not.toBe(copiedPersonDTO);
      const recievedAttrKeys = new Set(Object.keys(newPersonDTO));
      const expectedAttrKeys = new Set(['firstName', 'lastName']);
      expect(recievedAttrKeys).toEqual(expectedAttrKeys);
    });

    test('убирается один атрибут, получили тот же объект', () => {
      const copiedPersonDTO = sut.deepCopy(personDTO);

      const newPersonDTO = sut.excludeAttrs(copiedPersonDTO, 'age', false);

      expect(newPersonDTO).toBe(copiedPersonDTO);
      const recievedAttrKeys = new Set(Object.keys(newPersonDTO));
      const expectedAttrKeys = new Set(['firstName', 'lastName']);
      expect(recievedAttrKeys).toEqual(expectedAttrKeys);
    });
  });
  // Надо исправить ошибку с типами и проверить метод excludeDeepAttrs TODO: Нурболат
  describe('тест метода excludeDeepAttrs', () => {
    const personDTO = {
      firstName: 'Donald',
      lastName: 'Jumper',
      contacts: {
        phone: {
          code: '+7',
          num: '53252332',
        },
        email: {
          address: 'donald@example.com',
        },
      },
    };

    test('Уберем атрибут первого уровня', () => {
      const attrToDelete = 'firstName';

      const expectedDTO = {
        lastName: 'Jumper',
        contacts: {
          phone: {
            code: '+7',
            num: '53252332',
          },
          email: {
            address: 'donald@example.com',
          },
        },
      };

      const result = dtoUtility.excludeDeepAttrs(personDTO, attrToDelete);
      expect(result).toStrictEqual(expectedDTO);
    });

    test('Уберем атрибут второго уровня', () => {
      const attrToDelete = 'contacts.phone';

      const expectedDTO = {
        firstName: 'Donald',
        lastName: 'Jumper',
        contacts: {
          email: {
            address: 'donald@example.com',
          },
        },
      };

      const result = dtoUtility.excludeDeepAttrs(personDTO, attrToDelete);
      expect(result).toStrictEqual(expectedDTO);
    });

    test('Уберем атрибут третьего уровня', () => {
      const attrToDelete = 'contacts.email.address';

      const expectedDTO = {
        firstName: 'Donald',
        lastName: 'Jumper',
        contacts: {
          phone: {
            code: '+7',
            num: '53252332',
          },
          email: {
          },
        },
      };

      const result = dtoUtility.excludeDeepAttrs(personDTO, attrToDelete);
      expect(result).toStrictEqual(expectedDTO);
    });

    // Не работает метод когда массив строк TODO: Нурболат
    test('Уберем несколько атрибутов разного уровня', () => {
      const attrsToDelete = ['contacts.email.address', 'lastName'];

      const expectedDTO = {
        firstName: 'Donald',
        contacts: {
          phone: {
            code: '+7',
            num: '53252332',
          },
          email: {
          },
        },
      };

      const result = dtoUtility.excludeDeepAttrs(personDTO, attrsToDelete);
      expect(result).toStrictEqual(expectedDTO);
    });

    // Не работает метод когда массив строк TODO: Нурболат
    test('Проверка, что оригинал не трогается.', () => {
      const personDTOCopy = sut.deepCopy(personDTO);
      const attrsToDelete = ['firstName', 'contacts.phone'];
      const result = dtoUtility.excludeDeepAttrs(personDTO, attrsToDelete);

      expect(result).not.toEqual(personDTO);
      expect(personDTO).toStrictEqual(personDTOCopy);
    });
  });

  describe('Тестирование объединения объектов, исключая undefined атрибуты', () => {
    test('', async () => {
      type A = {
        a?: boolean,
        b?: string,
        c?: boolean,
      }
      const object1: A = {
        b: 'ok',
        c: false,
      };
      const object2: A = {
        a: false,
        b: 'okdsf',
        c: true,
      };

      expect(sut.mergeObjects(object1, object2)).toMatchObject({
        a: false,
        b: 'ok',
        c: false,
      });

      expect(sut.mergeObjects(object2, object1)).toMatchObject({
        a: false,
        b: 'okdsf',
        c: true,
      });
    });
  });

  describe('Получение значения объекта по вложенному ключу (DeepAttr)', () => {
    const storeDTO = {
      categories: {
        products: {
          banana: {
            price: 10,
          },
        },
      },
    };

    test('Успех. Без вложенности.', () => {
      const result = dtoUtility.getValueByDeepAttr(storeDTO, 'categories');
      expect(result).toMatchObject({ products: { banana: { price: 10 } } });
    });

    test('Успех. Одинарная вложенность.', () => {
      const result = dtoUtility.getValueByDeepAttr(storeDTO, 'categories.products');
      expect(result).toMatchObject({ banana: { price: 10 } });
    });

    test('Успех. Двойная вложенность.', () => {
      const result = dtoUtility.getValueByDeepAttr(storeDTO, 'categories.products.banana');
      expect(result).toMatchObject({ price: 10 });
    });

    test('Успех. Полная вложенность', () => {
      const result = dtoUtility.getValueByDeepAttr(storeDTO, 'categories.products.banana.price');
      expect(result).toBe(10);
    });

    test('После вызова метода исходный объект не изменен.', () => {
      const storeDTOCopy = dtoUtility.deepCopy(storeDTO);
      dtoUtility.getValueByDeepAttr(storeDTO, 'categories.products.banana');
      expect(storeDTO).toStrictEqual(storeDTOCopy);
    });

    test('Если запрашиваемый ключ - объект, '
        + 'то получаем действительную ссылку на него, а не копию.', () => {
      const banana = dtoUtility.getValueByDeepAttr<{ price: number }>(
        storeDTO,
        'categories.products.banana',
      ) as { price: number };
      const newBananaPrice = 25;
      banana.price = newBananaPrice;
      expect(storeDTO.categories.products.banana.price).toBe(newBananaPrice);
    });

    test('Не успех. Ключ отсутствует.', () => {
      expect(dtoUtility.getValueByDeepAttr(storeDTO, 'unknown'))
        .toBeUndefined();
    });

    test('Не успех. Ключ отсутствует. Исключение', () => {
      expect(() => dtoUtility.getValueByDeepAttr(storeDTO, 'unknown', true))
        .toThrow(new AssertionException('В объекте {"categories":{"products":{"banana":{"price":25}}}} отсутствует вложенный ключ unknown.'));
    });

    test('Не успех. Ключ отсутствует (вложенный).', () => {
      expect(dtoUtility.getValueByDeepAttr(storeDTO, 'categories.unknown'))
        .toBeUndefined();
    });

    test('Не успех. Ключ отсутствует (вложенный). Исключение', () => {
      expect(() => dtoUtility.getValueByDeepAttr(storeDTO, 'categories.unknown', true))
        .toThrow(new AssertionException('В объекте {"categories":{"products":{"banana":{"price":25}}}} отсутствует вложенный ключ categories.unknown.'));
    });

    test('Не успех. Ключ отсутствует (вложенный несколько раз).', () => {
      expect(dtoUtility.getValueByDeepAttr(storeDTO, 'categories.unknown.fake.another'))
        .toBeUndefined();
    });

    test('Не успех. Ключ отсутствует (вложенный несколько раз). Исключение', () => {
      expect(() => dtoUtility.getValueByDeepAttr(storeDTO, 'categories.unknown.fake.another', true))
        .toThrow(new AssertionException('В объекте {"categories":{"products":{"banana":{"price":25}}}} отсутствует вложенный ключ categories.unknown.fake.another.'));
    });

    test('Не успех. Ключ начинается с точки', () => {
      expect(() => dtoUtility.getValueByDeepAttr(storeDTO, '.categories'))
        .toThrow(new AssertionException('Ключ .categories не может начинаться или заканчиваться точкой и не может быть пустым'));
    });

    test('Не успех. Ключ заканчивается точкой', () => {
      expect(() => dtoUtility.getValueByDeepAttr(storeDTO, 'categories.'))
        .toThrow(new AssertionException('Ключ categories. не может начинаться или заканчиваться точкой и не может быть пустым'));
    });

    test('Не успех. Ключ пустая строка', () => {
      expect(() => dtoUtility.getValueByDeepAttr(storeDTO, ''))
        .toThrow(new AssertionException('Ключ  не может начинаться или заканчиваться точкой и не может быть пустым'));
    });
  });

  describe('Метод isDTO', () => {
    test('Object: true', () => {
      expect(dtoUtility.isDTO({ param: 'value' })).toEqual(true);
    });

    test('String: false', () => {
      expect(dtoUtility.isDTO('myString')).toEqual(false);
    });

    test('Array: false', () => {
      expect(dtoUtility.isDTO(['a', 'b', 'c'])).toEqual(false);
    });

    test('Set: false', () => {
      expect(dtoUtility.isDTO(new Set([1, 2, 4]))).toEqual(false);
    });

    test('Date: false', () => {
      expect(dtoUtility.isDTO(new Date())).toEqual(false);
    });

    test('Undefined: false', () => {
      expect(dtoUtility.isDTO(undefined)).toEqual(false);
    });

    test('Null: false', () => {
      expect(dtoUtility.isDTO(null)).toEqual(false);
    });
  });
});
