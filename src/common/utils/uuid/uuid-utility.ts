import { AssertionException, UuidType } from '../../types';

class UUIDUtility {
  private uuidRegex = '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$';

  getNewUUID(): UuidType {
    return crypto.randomUUID();
  }

  isValidValue(value?: unknown): boolean {
    return typeof value === 'string' && new RegExp(this.uuidRegex).test(value);
  }

  cleanValue(value?: unknown): UuidType {
    if (this.isValidValue(value)) {
      return value as UuidType;
    }
    throw new AssertionException(
      `Значение ${value} не является валидным для типа UUID v4`,
    );
  }
}

export const uuidUtility = new UUIDUtility();
