/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DTO } from '../../../domain/dto';
import { AssertionException } from '../../exeptions';
import {
  DeepPartial,
  ExcludeDeepDtoAttrs, ExcludeDtoAttrs, ExtendDtoAttrs, GetDtoKeysByDotNotation,
} from '../../type-functions';
import { DeepAttr } from '../../types';
import { dodUtility } from '../domain-object/dod-utility';

export class dtoUtility {
  /** Возвращает копию объекта T, с исключенными атрибутами K. */
  static excludeAttrs<
    T extends DTO,
    K extends keyof T | ReadonlyArray<keyof T>
  >(obj: T, excludeAttrs: K, copy = true): ExcludeDtoAttrs<T, K> {
    const returnObj = copy ? this.deepCopy(obj) : obj;
    const excludeAttrsArr = (
      Array.isArray(excludeAttrs) ? excludeAttrs : [excludeAttrs]
    ) as ReadonlyArray<keyof T>;

    Object.keys(obj).forEach((key) => {
      if (excludeAttrsArr.indexOf(key) >= 0) delete returnObj[key];
    });
    return returnObj;
  }

  /** Возвращает копию объекта , расширенный атрибутами с объекта P.
  * - Если P[key]=undefined, то значение [key] тоже станет undefined.
  * - Если типы T[key] и P[key] не одинаковы, то вернется объект с типом P[key] */
  static extendAttrs<
    T extends DTO,
    P extends DTO,
  >(obj: T, newValues: P, copy = true): ExtendDtoAttrs<T, P> {
    const returnObj = copy ? this.deepCopy(obj) : obj;
    Object.keys(newValues).forEach((key) => {
      returnObj[key as keyof T] = newValues[key] as typeof obj[typeof key];
    });
    return returnObj as ExtendDtoAttrs<T, P>;
  }

  /** Возвращает объект T, со значениями с объекта P.
  * - Обнавляются только существующие атрибуты,
  *   новые атрибуты объявленные в P не добавляются.
  * - Если P[key] имеет значение undefined, то значение остается старым.
  * - Если copy=true возвращается копия объекта, иначе тот же объект */
  static replaceAttrs<
    T extends DTO,
    P extends DeepPartial<T>,
  >(obj: T, newValues: P, copy = true): T {
    const returnObj = copy ? this.deepCopy(obj) : obj;
    Object.entries(newValues).forEach(([key, value]) => {
      if (!(key in obj) || value === undefined) {
        /* not added new keys and not replaced undefined value */
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        returnObj[key as keyof T] = this.replaceAttrs(obj[key], value, copy);
      } else {
        returnObj[key as keyof T] = value;
      }
    });
    // Object.keys(obj).forEach((key) => {
    //   if (
    //     Object.keys(newValues).includes(key)
    //     && newValues[key] !== undefined
    //   ) {
    //     returnObj[key as keyof T] = newValues[key] as typeof obj[typeof key];
    //   }
    // });
    return returnObj;
  }

  /**
   * Deep copy function for TypeScript.
   * @param T Generic type of target/copied value.
   * @param target Target value to be copied.
   * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
   * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
   */
  static deepCopy<T extends DTO>(target: T): T {
    if (target === null) {
      return target;
    }
    if (target instanceof Date) {
      return new Date(target.getTime()) as any;
    }
    if (target instanceof Array) {
      const cp = [] as any[];
      (target as any[]).forEach((v) => { cp.push(v); });
      return cp.map((n: any) => this.deepCopy<any>(n)) as any;
    }
    if (typeof target === 'object' && Object.keys(target).length > 0) {
      const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
      Object.keys(cp).forEach((k) => {
        cp[k] = this.deepCopy<any>(cp[k]);
      });
      return cp as T;
    }
    return target;
  }

  /** Исключить атрибуты в DTO, включая вложенные.
  * @param {DTO} obj объект, копию которого мы хотим получить.
  * @param {Array<DeepAttr>} excludedAttrs массив атрибутов в точечной нотации.
  *   т.е: ['name', 'phone.number'] вернет копию объекта без
  *   атрибута 'name' в основном объекте и без атрибута 'number'
  *   во вложенном объекте 'phone'. */
  static excludeDeepAttrs<
    ATTRS extends DTO,
    EXC extends GetDtoKeysByDotNotation<ATTRS> | GetDtoKeysByDotNotation<ATTRS>[]
  >(obj: ATTRS, excludedAttrs: EXC): ExcludeDeepDtoAttrs<ATTRS, EXC> {
    const objCopy = this.deepCopy(obj);
    const attrs = Array.isArray(excludedAttrs) ? excludedAttrs : [excludedAttrs];

    const deepDelete = (dto: DTO, attributePath: string): void => {
      const attributePathAsArray = attributePath.split('.');

      attributePathAsArray.forEach((levelAttr: string, idx: number): void => {
        if (idx !== attributePathAsArray.length - 1) {
          dto = dto[levelAttr];
        }
      });

      if (dto !== undefined) {
        delete dto[attributePathAsArray.pop() as string];
      }

      return undefined;
    };

    attrs.forEach((excludedAttr: string) => {
      deepDelete(objCopy, excludedAttr);
    });

    return objCopy as unknown as ExcludeDeepDtoAttrs<ATTRS, EXC>;
  }

  /**
   * Объединяет два объекта.
   * В приоритете первый объект, только если значение его атрибута не undefined.
   * Иначе берется значение атрибута второго объекта.
   * @param object1
   * @param object2
  */
  static mergeObjects<T extends {[key: string]: Exclude<any, null>}>(
    object1: Readonly<T>,
    object2: Readonly<T>,
  ): T {
    const res: T = { ...object1 };

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(object1).concat(Object.keys(object2))) {
      res[key as keyof T] = object1[key] !== undefined ? object1[key] : object2[key];
    }

    return res;
  }

  static getValueByDeepAttr<T>(
    dto: DTO,
    key: DeepAttr,
    throwError = false,
  ): T | undefined {
    if (key.startsWith('.') || key.endsWith('.') || key === '') {
      throw new AssertionException(
        `Ключ ${key} не может начинаться или заканчиваться точкой и не может быть пустым`,
      );
    }
    const attributePathAsArray = key.split('.');
    let resultStorage = dto;

    try {
      attributePathAsArray.forEach((levelAttr: string, idx: number): void => {
        if (idx !== attributePathAsArray.length) {
          if (!(levelAttr in resultStorage)) throw new TypeError();
          resultStorage = resultStorage[levelAttr];
        }
      });
      return resultStorage as T;
    } catch (err) {
      if (err instanceof TypeError) {
        if (throwError) {
          throw new AssertionException(
            `В объекте ${JSON.stringify(dto)} отсутствует вложенный ключ ${key}.`,
          );
        }
        return undefined;
      }
      throw err;
    }
  }

  static isDTO(value: unknown): value is DTO {
    return value !== undefined
      && value !== null
      && value.constructor === Object;
  }

  static cleanFromUndefinedAndEmptyObjects = ((): (obj: DTO) => DTO => {
    const cleanFromUndefinedValues = (obj: DTO): DTO => JSON.parse(JSON.stringify(obj));
    const cleanFromEmptyObjects = (obj: DTO): DTO => {
      for (const k in obj) {
        if (typeof obj[k] !== 'object' || Array.isArray(obj[k])) {
          continue;
        }
        cleanFromEmptyObjects(obj[k]);
        if (Object.keys(obj[k]).length === 0) {
          delete obj[k];
        }
      }
      return obj;
    };
    return (obj: DTO): DTO => cleanFromEmptyObjects(cleanFromUndefinedValues(obj));
  })();
}
