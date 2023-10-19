import { joinMethodsOf } from './join-methods-of';

let setACalled = false;
let setBCalled = false;
let goCalled = false;

class A {
  setA(): void {
    setACalled = true;
  }

  go(): void {
    goCalled = true;
  }
}

@joinMethodsOf(A)
class B {
  go(): void {
    goCalled = false;
  }

  setB(): void {
    setBCalled = true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface B extends A {}

test('mixin', () => {
  expect(new Set(Object.getOwnPropertyNames(B.prototype)))
    .toMatchObject(new Set(['constructor', 'setA', 'go', 'setB']));

  expect(B.prototype.go).toBe(A.prototype.go);
  expect(B.prototype.setA).toBe(A.prototype.setA);

  const b = new B();
  b.go();
  expect(goCalled).toBeTruthy();
  b.setB();
  expect(setBCalled).toBeTruthy();
  b.setA();
  expect(setACalled).toBeTruthy();
});
