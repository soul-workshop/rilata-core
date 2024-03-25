import {
  describe, expect, spyOn, test,
} from 'bun:test';
import { IncorrectTokenError, JwtVerifyErrors, NotValidTokenPayloadError, TokenExpiredError } from '../../../src/app/jwt/jwt-errors';
import { UserId } from '../../../src/common/types';
import { JwtCreator } from '../../app/jwt/jwt-creator';
import { JwtDecoder } from '../../app/jwt/jwt-decoder';
import { JwtVerifier } from '../../app/jwt/jwt-verifier';
import { ServerResolver } from '../../app/server/server-resolver';
import { JwtConfig } from '../../app/server/types';
import { ConsoleLogger } from '../../common/logger/console-logger';
import { Logger } from '../../common/logger/logger';
import { uuidUtility } from '../../common/utils/uuid/uuid-utility';
import { BaseJwtDecoder } from './base-jwt-decoder';
import { JwtCreatorImpl } from './jwt-creator';
import { JwtVerifierImpl } from './jwt-verifier';

type TestJwtPayload = {
  userId: UserId,
};

const jwtExpiredTime = new Date('1970-01-26T23:25:55.302Z').getTime(); // 2244355302
const refreshJwtExpiredTime = new Date('1970-01-28T23:25:55.302Z').getTime(); // 2417155302

class TestJwtDecoder extends BaseJwtDecoder<TestJwtPayload> {
  constructor(public expiredTimeShiftAsMs: number) {
    super();
  }

  payloadBodyIsValid(payload: TestJwtPayload): boolean {
    return uuidUtility.isValidValue(payload.userId);
  }

  getNow(): number {
    return jwtExpiredTime - 2000; // tokenTime - 2 second;
  }
}

function getJwtFakeResolver(expiredTimeShiftAsMs: number): ServerResolver<TestJwtPayload> {
  const decoder = new TestJwtDecoder(expiredTimeShiftAsMs);
  const creator = new JwtCreatorImpl<TestJwtPayload>();
  const verifier = new JwtVerifierImpl<TestJwtPayload>();

  const resolver = {
    getLogger(): Logger {
      return new ConsoleLogger();
    },

    getJwtDecoder(): JwtDecoder<TestJwtPayload> {
      return decoder;
    },

    getJwtCreator(): JwtCreator<TestJwtPayload> {
      return creator;
    },

    getJwtVerifier(): JwtVerifier<TestJwtPayload> {
      return verifier;
    },

    getJwtSecretKey(): string {
      return 'your-256-bit-secret';
    },

    getJwtConfig(): Required<JwtConfig> {
      return {
        algorithm: 'HS256',
        jwtLifetimeAsHour: 24,
        jwtRefreshLifetimeAsHour: 24 * 3,
      };
    },
  } as unknown as ServerResolver<TestJwtPayload>;

  decoder.init(resolver);
  creator.init(resolver);
  verifier.init(resolver);
  return resolver;
}

const backendJwtResolver = getJwtFakeResolver(0); // backend expired jwt shift time === 0

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
const correctToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInJFeHAiOjI0MTcxNTUzMDJ9.klqXEEjJiYFsdfKy2aNIAo0L3VKg-8x5JTMw4PnxG3M';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmqiLCJleHAiOjIyNDQzNTUzMDIsInJFeHAiOjI0MTcxNTUzMDJ9.klqXEEjJiYFsdfKy2aNIAo0L3VKg-8x5JTMw4PnxG3M';

describe('all jwt tests', () => {
  describe('decode jwt tests', () => {
    const sut = backendJwtResolver.getJwtDecoder();

    test('Успех, получена полезная нагрузка с токена', () => {
      const result = sut.getTokenPayload(correctToken);
      expect(result.isSuccess()).toBe(true);
      const payloadValue = result.value as TestJwtPayload;
      expect(payloadValue.userId).toBe('536e7463-b24d-4e7b-bad9-2bd2ed8011fd');
      expect(Object.keys(payloadValue)).toEqual(['userId']);
    });

    test('Провал, тело токена невалидно', () => {
      const payload = sut.getTokenPayload(incorrectToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as IncorrectTokenError).toEqual(incorectTokenError);
    });

    test('Провал, тело токена невалидно - дата истечения не является числом', () => {
      const expIncorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOiIyMjQ0czU1MzAyIiwickV4cCI6MjQxNzE1NTMwMn0.1vU_AuUUQSGTSSaix-DfjApOU5_Jbivk8nyokzwTe5s';
      const payload = sut.getTokenPayload(expIncorrectToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as IncorrectTokenError).toEqual(incorectTokenError);
    });

    test('Провал, тело токена невалидно - дата истечения refresh не является числом', () => {
      const refreshIncorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInJFeHAiOiIyNDE3MTU1czAyIn0.bV0DN0NasLow4dVROMPL3Cri03yMuQg-WYdk1AWMMw4';
      const payload = sut.getTokenPayload(refreshIncorrectToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as IncorrectTokenError).toEqual(incorectTokenError);
    });

    test('Провал, тело токена невалидно - по валидации тела токена', () => {
      const notValidPayloadToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2LWIyNGQtNGU3Yi1iYWQ5LTJiZDJlZDgwMTFmZCIsImV4cCI6MjI0NDM1NTMwMiwickV4cCI6MjQxNzE1NTMwMn0.R9kJAoBizD45Mb9H6O6LZ_-lsvAzgcTFuL7-FeIxsjg';
      const payload = sut.getTokenPayload(notValidPayloadToken);
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
        spyOn(sut, 'getNow').mockReturnValueOnce(jwtExpiredTime + 10);
        const payload = sut.getTokenPayload(correctToken);
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
        const frontendResolver = getJwtFakeResolver(3000); // frontend jwt expired timeshift 3000 ms
        const frontendSut = frontendResolver.getJwtDecoder();
        const payload = frontendSut.getTokenPayload(correctToken);
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

    describe('refresh token tests', () => {
      const refreshSut = backendJwtResolver.getJwtDecoder();

      test('успех, время рефреш токена не истекло', () => {
        const result = refreshSut.refreshDateIsExpired(correctToken);
        expect(result).toBe(false);
      });

      test('провал, время рефреш токена не числовое', () => {
        const refreshIncorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInJFeHAiOiIyNDE3MTU1czAyIn0.bV0DN0NasLow4dVROMPL3Cri03yMuQg-WYdk1AWMMw4';
        const result = refreshSut.refreshDateIsExpired(refreshIncorrectToken);
        expect(result).toBe(true);
      });

      test('провал, время рефреш токена не истекло', () => {
        spyOn(refreshSut, 'getNow').mockReturnValueOnce(refreshJwtExpiredTime + 10);
        const result = refreshSut.refreshDateIsExpired(correctToken);
        expect(result).toBe(true);
      });
    });
  });

  describe('create jwt tests', () => {
    const sut = backendJwtResolver.getJwtCreator();
    const decoder = backendJwtResolver.getJwtDecoder();

    test('успех, токен создан успешно', () => {
      const jwtLifeTimeAsMs = backendJwtResolver.getJwtConfig().jwtLifetimeAsHour * 60 * 60 * 1000;
      spyOn(decoder, 'getNow').mockReturnValueOnce(
        jwtExpiredTime - jwtLifeTimeAsMs,
      );
      const jwt = sut.createToken({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' });
      expect(jwt).toBe(correctToken);

      const payloadResult = decoder.getTokenPayload(jwt);
      expect(payloadResult.isSuccess()).toBeTrue();
      expect(payloadResult.value).toEqual({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' });
    });
  });

  describe('verify jwt tests', () => {
    const sut = backendJwtResolver.getJwtVerifier();

    test('успех, верификация прошла усешно', () => {
      const verifyResult = sut.verifyToken(correctToken);
      expect(verifyResult.isSuccess()).toBeTrue();
      expect(verifyResult.value).toEqual({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' });
    });

    test('провал, верификация прошла неуспешно', () => {
      const verifyResult = sut.verifyToken(incorrectToken);
      expect(verifyResult.isFailure()).toBeTrue();
      expect((verifyResult.value as JwtVerifyErrors).name).toBe('JwtVerifyError');
    });

    test('провал, верификация прошла неусешно по секретному ключу', () => {
      const decoder = backendJwtResolver.getJwtDecoder();
      const jwtLifeTimeAsMs = backendJwtResolver.getJwtConfig().jwtLifetimeAsHour * 60 * 60 * 1000;
      spyOn(decoder, 'getNow').mockReturnValueOnce(
        jwtExpiredTime - jwtLifeTimeAsMs,
      );

      // token generated by secret key = 'your-256-bit-secre'. Valid key = 'your-256-bit-secret'
      const incorrectTokenBySecretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInJFeHAiOjI0MTcxNTUzMDJ9.eaj4ULii2Qu9mDMrWnPvGoMQL39vWNkKX4piCH3NNKU';
      const verifyResult = sut.verifyToken(incorrectTokenBySecretKey);
      expect(verifyResult.isFailure()).toBeTrue();
      expect((verifyResult.value as JwtVerifyErrors).name).toBe('JwtVerifyError');
    });
  });
});
