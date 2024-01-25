import { describe, expect, test } from 'bun:test';
import { DTO } from '../../../../src/domain/dto';
import { DtoFieldValidator } from '../../../../src/domain/validator/field-validator/dto-field-validator';
import { LiteralFieldValidator } from '../../../../src/domain/validator/field-validator/literal-field-validator';
import { FullFieldResult } from '../../../../src/domain/validator/field-validator/types';
import { success } from '../../../../src/common/result/success';
import { UUIDFormatValidationRule } from '../../../../src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { failure } from '../../../../src/common/result/failure';

class UserRequestDtoFieldValidator extends DtoFieldValidator<
'getUser',
true,
false,
{ userId?: string, onMe?: boolean}
> {
    constructor(){
        super('getUser', true, { isArray: false }, 'dto', userRequestDTOValidatorMap);
    }
    protected complexValidate(value: DTO): FullFieldResult {
        const keys = Object.keys(value);

        if (keys.length === 1 && (keys.includes('userId') || keys.includes('onMe'))) {
            return success(undefined);
        } else {
            return failure({
                ___dto_whole_value_validation_error___: [
                {
                    text: 'DTO должен содержать либо userId, либо onMe',
                    name: 'IsDTOTypeRule',
                    hint: {},
                },
            ],
        });
        }
        
    }
}

const userRequestDTOValidatorMap = {
    userId: new LiteralFieldValidator('userId', false, { isArray: false }, 'string', [new UUIDFormatValidationRule()]),
    onMe: new LiteralFieldValidator ('onMe', false, { isArray:false }, 'boolean', [])
};

describe('User Request DTO валидатор тест', () => {
    const sut = new UserRequestDtoFieldValidator();
    test('Успех, обьект валидный', ()=>{
        const result = sut.validate({
            onMe:true
        });
        expect(result.isSuccess()).toBe(true);
    });
    test('Успех, обьект валидный', ()=>{
        const result = sut.validate({
            userId: 'd092833c-4bc6-405d-976e-912511fa85e3'
        });
        expect(result.isSuccess()).toBe(true);
    });
    test('Провал, обьект должен содержать либо userId, либо onMe',()=>{
        const result = sut.validate({
            onMe:true,
            userId: 'd092833c-4bc6-405d-976e-912511fa85e3'
        });
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
            ___dto_whole_value_validation_error___: [
            {
                text: 'DTO должен содержать либо userId, либо onMe',
                name: 'IsDTOTypeRule',
                hint: {},
            },
        ],
    });
    });
});