import { describe, expect, it } from 'bun:test';
import { InvalidTokenError } from '../../../src/app/jwt/errors';
import { DecodedToken } from '../../../src/app/jwt/types';
import { JWTDecodeLibJWTManager } from '../../../src/infra/jwt/jwt-decode-lib.jwt-manager';

type TestJWTPayload = {
  id: string,
  govPersonID: string,
};

class TestJWTManager extends JWTDecodeLibJWTManager<TestJWTPayload> {}

const jwtManager = new TestJWTManager();
const correctToken = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJwYXlsb2FkIjp7ImlkIjoiNjkyZTA5OWQtYzlhYi00YWM2LWJhMWMtMWZmYTJmNDRlODRhIiwiZ292UGVyc29uSUQiOiI2NDcxNzQ2Mzg3NDEifSwiaWF0IjoxNjMwMDY5ODg5LCJleHAiOjE2MzAxMDU4ODl9.kGPc2gf-lFaWkimVsloVy4epkZEVn-dMnMxCA20il6yuJzp7dxOOD8gMWcvbjstV20dOk6nh4NxGKqYorNjPBIVfS4xuOcK4Cnt6YGp_hkkry18O2ZtWIzo-VFVBNDahlb6OZjxOvZEHTNLLXezvVJsPtt48iNR5QZytCH7hyoXgVa0g_0BaKPjMesVb6w7dku8ehu1QU-ZaGB7G9pmMi1e5tLgKIhl-oSn8PVkb7nkU4GKIZjZ-wacEtLDp-vQZJ73tEX4Vc1OV6eOVT5n5E32yh7UtaHb_Roae7zHhz5ULJsjbzNgjjIHYhwYvSyKBs2gtMoFdKB9MDG2urA8HN02GQXQIxwwbyAE9HDqj4MrkVEVmW3Ki04YRg76ExcUzlESwlUmGFA0YyIIcnudVydlVlETiwdhrxc52-_GZNSM1UQ2rI43WuxJICvZc5m-jaEJSOAEWXk6VT0fxCiJqCeBWmkNyaulpLmqddJwDpTojRZThsJFkfVZs3sTN84FE9K0JvClFZXwomhhQKdZVEbK4JF0zTQb-PvbO1SnxOR5R3SDtCnpiN2PQIMaKZeKa0BiJgQfsR_psumeJ-x0UStMfsGU2iUZAjKbOIhgOXbSVPg1iY1PqRq1MFj4bgbmPP4oyOHxudbOIqDX9BFyZGOzgEY7dvJE-JpGI-UnsgQI';
const incorrectToken = 'qwe';

describe('Тест метода decodeToken', () => {
  it('Успешный тест', () => {
    const payload = jwtManager.decodeToken(correctToken);
    expect(payload.isSuccess()).toBeTruthy();
    expect(typeof (payload.value as DecodedToken<TestJWTPayload>).exp).toEqual('number');
    expect(typeof (payload.value as DecodedToken<TestJWTPayload>).iat).toEqual('number');
    expect(typeof (payload.value as DecodedToken<TestJWTPayload>).payload.id).toBe('string');
    expect(typeof (payload.value as DecodedToken<TestJWTPayload>).payload.govPersonID).toBe('string');
  });

  it('Неуспешный тест. Формат токена не верный', () => {
    const payload = jwtManager.getTokenPayload(incorrectToken);
    expect(payload.isFailure()).toBeTruthy();
    expect((payload.value as InvalidTokenError).meta.name).toEqual('InvalidTokenError');
  });
});

describe('Тест метода getTokenPayload', () => {
  it('Успешный тест', () => {
    const payload = jwtManager.getTokenPayload(correctToken);
    expect(payload.isSuccess()).toBeTruthy();
    expect(typeof (payload.value as TestJWTPayload).id).toEqual('string');
    expect(typeof (payload.value as TestJWTPayload).govPersonID).toEqual('string');
  });

  it('Неспешный тест. Формат токена не верный', () => {
    const payload = jwtManager.getTokenPayload(incorrectToken);
    expect(payload.isFailure()).toBeTruthy();
    expect((payload.value as InvalidTokenError).meta.name).toEqual('InvalidTokenError');
  });
});
