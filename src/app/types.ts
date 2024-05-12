export type RunMode = 'test' | 'dev' | 'prod';

export type Asyncable<ASYNC extends boolean, T> = ASYNC extends true ? Promise<T> : T;
