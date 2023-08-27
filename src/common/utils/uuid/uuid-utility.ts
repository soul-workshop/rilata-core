import { v4 as UUIDV4 } from 'uuid';
import { AssertionException } from '../../exceptions';
import { UUIDType } from '../../types';

export class UUIDUtility {
  private static uuidRegex = '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$';

  static getNewUUIDValue(): UUIDType {
    return UUIDV4();
  }

  static isValidValue(value?: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return new RegExp(this.uuidRegex).test(value);
  }

  static cleanValue(value?: unknown): UUIDType {
    if (this.isValidValue(value)) {
      return value as UUIDType;
    }
    throw new AssertionException(
      `Значение ${value} не является валидным для типа UUID v4`,
    );
  }
}
