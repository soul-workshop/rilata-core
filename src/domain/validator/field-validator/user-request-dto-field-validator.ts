import { DTO } from "../../dto";
import { DtoFieldValidator } from "./dto-field-validator";

export class UserRequestFieldValidator extends DtoFieldValidator<
'getUser',
true,
false,
DTO
> {
    constructor(){
        super('getUser', true, { isArray: false }, 'dto',);
    }
}