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

        if (Boolean(value.userId) !== Boolean(value.onMe)) {
            return success(undefined);
        } else {
            return failure({
                ___dto_whole_value_validation_error___: [
                {
                    text: 'DTO должен содержать либо userId, либо onMe',
                    name: 'InvalidFieldCombinationError',
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
    test('Успех, обьект c ключом onMe валидный', ()=>{
        const result = sut.validate({
            onMe:true
        });
        expect(result.isSuccess()).toBe(true);
    });
    test('Успех, обьект c ключом userId валидный', ()=>{
        const result = sut.validate({
            userId: 'd092833c-4bc6-405d-976e-912511fa85e3'
        });
        expect(result.isSuccess()).toBe(true);
    });
    test('Провал, получено оба валидные ключи (userId, onMe)',()=>{
        const result = sut.validate({
            onMe:true,
            userId: 'd092833c-4bc6-405d-976e-912511fa85e3'
        });
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
            ___dto_whole_value_validation_error___: [
            {
                text: 'DTO должен содержать либо userId, либо onMe',
                name: "InvalidFieldCombinationError",
                hint: {},
            },
        ],
    });
    });

    test('Провал, получено оба ключа со значением undefined (userId, onMe)', () => {
        const result = sut.validate({});
        expect(result.isFailure()).toBe(true);
        expect(result.value).toEqual({
            ___dto_whole_value_validation_error___: [
              {
                text: "DTO должен содержать либо userId, либо onMe",
                name: "InvalidFieldCombinationError",
                hint: {},
              }
            ],
          });
    });
});