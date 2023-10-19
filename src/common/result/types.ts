/* eslint-disable @typescript-eslint/no-unused-vars */
import { Failure } from './failure';
import { Success } from './success';

// ----------- ResultType -------------
/** Основной тип Result */
export type Result<F, S> = Failure<F, S> | Success<F, S>;

/** Тип позволяет работать без дженериков в местах где это необходимо */
export type GeneralResult = Result<unknown, unknown>;

export type InferSuccess<RES extends Result<unknown, unknown>> =
    RES extends Result<infer FAIL, infer SCSS> ? SCSS : never;

export type InferFailure<RES extends Result<unknown, unknown>> =
    RES extends Result<infer FAIL, infer SCSS> ? FAIL : never;
