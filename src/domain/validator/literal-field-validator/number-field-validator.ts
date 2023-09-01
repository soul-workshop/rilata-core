import { BaseFieldValidator } from './base.field-validator';

export abstract class NumberFieldValidator<
  REQ extends boolean, ARR extends boolean
> extends BaseFieldValidator<REQ, ARR> {
  protected type = 'number' as const;
}
