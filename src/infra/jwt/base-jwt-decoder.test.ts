import {
  describe, expect, spyOn, test,
} from 'bun:test';
import { IncorrectTokenError, NotValidTokenPayloadError, TokenExpiredError } from '../../../src/app/jwt/jwt-errors';
import { UserId } from '../../../src/common/types';
import { uuidUtility } from '../../common/utils/uuid/uuid-utility';
import { BaseJwtDecoder } from './base-jwt-decoder';

type TestJWTPayload = {
  userId: UserId,
};

class TestJwtDecoder extends BaseJwtDecoder<TestJWTPayload> {
  constructor(public expiredTimeShiftAsMs: number) {
    super();
  }

  verifyPayloadBody(payload: TestJWTPayload): boolean {
    return uuidUtility.isValidValue(payload.userId);
  }

  getNow(): number {
    return new Date('1970-01-26T23:25:55.302Z').getTime() - 2000; // tokenTime - 2 second;
  }
}

const backendJwtDecoder = new TestJwtDecoder(0);

const correctToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDJ9.9T3LOUiZMvfpTzx6gs1GFKNV2k1gQ40F8lTvGREII7U';

const incorectTokenError: IncorrectTokenError = {
  locale: {
    text: 'Невозможно расшифровать токен. Токен имеет не верный формат.',
    hint: {},
    name: 'IncorrectTokenError',
  },
  name: 'IncorrectTokenError',
  meta: {
    domainType: 'error',
    errorType: 'domain-error',
  },
};

describe('Тест метода decodeToken', () => {
  test('Успешный тест', () => {
    const result = backendJwtDecoder.getTokenPayload(correctToken);
    expect(result.isSuccess()).toBe(true);
    const payloadValue = result.value as TestJWTPayload;
    expect(payloadValue.userId).toBe('536e7463-b24d-4e7b-bad9-2bd2ed8011fd');
  });

  test('Провал, тело токена невалидно', () => {
    const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNdQzNTUzMDJ9.9T3LOUiZMvfpTzx6gs1GFKNV2k1gQ40F8lTvGREII7U';
    const payload = backendJwtDecoder.getTokenPayload(incorrectToken);
    expect(payload.isFailure()).toBe(true);
    expect(payload.value as IncorrectTokenError).toEqual(incorectTokenError);
  });

  test('Провал, тело токена невалидно - дата истечения не является числом', () => {
    const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNWQzNTUzMDJ9.048isAU4tOJ2XBTi1RTPALa1806eNtuqheki5V3vA0I';
    const payload = backendJwtDecoder.getTokenPayload(incorrectToken);
    expect(payload.isFailure()).toBe(true);
    expect(payload.value as IncorrectTokenError).toEqual(incorectTokenError);
  });

  test('Провал, тело токена невалидно - по валидации тела токена', () => {
    const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1M2U3NDYzLWIyNGQtNGU3Yi1iYWQ5LTJiZDJlZDgwMTFmZCIsImV4cCI6MjI0NDM1NTMwMn0.ZxY6llNK2yzENu3FOGW10qVf1kd5HyH4zn-1sV-fxes';
    const payload = backendJwtDecoder.getTokenPayload(incorrectToken);
    expect(payload.isFailure()).toBe(true);
    expect(payload.value as NotValidTokenPayloadError).toEqual({
      locale: {
        text: 'Невалидная полезная нагрузка в токене.',
        hint: {},
        name: 'NotValidTokenPayloadError',
      },
      name: 'NotValidTokenPayloadError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });

  describe('time expired tests', () => {
    test('Провал, время токена истекло', () => {
      spyOn(backendJwtDecoder, 'getNow').mockReturnValueOnce(
        new Date('1970-01-26T23:25:55.302Z').getTime() + 10,
      );
      const payload = backendJwtDecoder.getTokenPayload(correctToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as TokenExpiredError).toEqual({
        locale: {
          text: 'Токен просрочен.',
          hint: {},
          name: 'TokenExpiredError',
        },
        name: 'TokenExpiredError',
        meta: {
          domainType: 'error',
          errorType: 'domain-error',
        },
      });
    });

    test('Провал, время токена истекло - случай для фронта с timeshift равной 3 секунды', () => {
      const frontendJwtDecoder = new TestJwtDecoder(3000);
      const payload = frontendJwtDecoder.getTokenPayload(correctToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as TokenExpiredError).toEqual({
        locale: {
          text: 'Токен просрочен.',
          hint: {},
          name: 'TokenExpiredError',
        },
        name: 'TokenExpiredError',
        meta: {
          domainType: 'error',
          errorType: 'domain-error',
        },
      });
    });
  });
});
