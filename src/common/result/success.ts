import { Result } from './types';
import { Failure } from './failure';

export class Success<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isFailure(): this is Failure<F, S> {
    return false;
  }

  isSuccess(): this is Success<F, S> {
    return true;
  }
}

export const success = <F, S>(a: S): Result<F, S> => new Success<F, S>(a);
