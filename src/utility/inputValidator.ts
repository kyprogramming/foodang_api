import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

// export const inputValidator = () => {
//     const createAdminInputs = plainToClass(SignupAdminInput, req.body);
//     const validationError = await validate(createAdminInputs, { validationError: { target: true } });
// };

export async function validateInput<T extends object>(dtoClass: new () => T, input: any): Promise<ValidationError[]> {
    const dtoInstance = plainToClass(dtoClass, input);
    const validationErrors = await validate(dtoInstance, { validationError: { target: true } });
    return validationErrors;
}
