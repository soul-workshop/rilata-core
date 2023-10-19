/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructor } from '../types';

export function joinMethodsOf(mixinConstr: Constructor<any>) {
  return function mixinDecorator(targetClass: Constructor<any>): Constructor<any> {
    Object.getOwnPropertyNames(mixinConstr.prototype).forEach((name) => {
      Object.defineProperty(
        targetClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(mixinConstr.prototype, name) as PropertyDescriptor,
      );
    });
    return targetClass;
  };
}
