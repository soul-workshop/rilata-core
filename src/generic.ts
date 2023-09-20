export class A<T extends string> {
  protected value!: T;

  setValue(value: T): void {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

export class S {
  protected value!: string;

  setValue(value: string): void {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

const s = new S();
s.setValue('3');

const a = new A<'b'>();
// a.setValue(3);
// a.setValue('3');
a.setValue('a');
const b = a.getValue();
