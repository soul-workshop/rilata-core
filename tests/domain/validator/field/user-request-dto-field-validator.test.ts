import { describe, expect, test } from 'bun:test';
import { DTO } from '../../../../src/domain/dto';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';

export class UserRequestFieldValidator extends DtoFieldValidator<
'getUser',
true,
false,
DTO
> {
    constructor(){
        super('getUser', true, { isArray: false }, 'dto', personAttrsValidatrorMap);
    }
}

export const personAttrsValidatrorMap = {
    userId: new LiteralFieldValidator('userId', false, { isArray: false }, 'string', []),
    onMe: new LiteralFieldValidator ('onMe', false, { isArray:false }, 'boolean', [])
};

describe('User Request DTO валидатор тест', () => {
    test('Успех, обьект валидный', ()=>{

    })
});