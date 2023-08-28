import { v4 as UUIDV4 } from 'uuid';
import { AssertionException } from '../../exceptions';
import { UuidType } from '../../types';

export class UUIDUtility {
  private static uuidRegex = '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$';

  static getNewUUIDValue(): UuidType {
    return UUIDV4();
  }

  static isValidValue(value?: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return new RegExp(this.uuidRegex).test(value);
  }

  static cleanValue(value?: unknown): UuidType {
    if (this.isValidValue(value)) {
      return value as UuidType;
    }
    throw new AssertionException(
      `Значение ${value} не является валидным для типа UUID v4`,
    );
  }
}
