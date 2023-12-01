import { AssertionException } from '../../types';

export class HTTPUtility {
  encodeArrayQueryParam(param: unknown[]): string {
    if (!Array.isArray(param)) {
      throw new AssertionException(
        'В HTTPUtility.encodeArrayQueryParam аргументом передан не массив.',
      );
    }
    return param.join(',');
  }

  decodeArrayQueryParam(param: string): string[] {
    if (typeof param !== 'string') {
      throw new AssertionException(
        'В HTTPUtility.decodeArrayQueryParam аргументом передана не строка.',
      );
    }
    return param === '' ? [] : param.split(',');
  }
}

export const httpUtility = Object.freeze(new HTTPUtility());
