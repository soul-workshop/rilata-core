import { BaseFieldValidator } from './base.field-validator';

export abstract class StringFieldValidator<
  REQ extends boolean, ARR extends boolean
> extends BaseFieldValidator<REQ, ARR> {
  protected type = 'string' as const;
}
