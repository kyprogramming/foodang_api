import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import customResponse from "./customResponse";

// export const inputValidator = () => { const createAdminInputs = plainToClass(SignupAdminInput, req.body); const validationError = await validate(createAdminInputs, { validationError: { target: true
//     } }); };

export async function validateInput<T extends object>(dtoClass: new () => T, input: any): Promise<ValidationError[]> {
    const dtoInstance = plainToClass(dtoClass, input);
    const validationErrors = await validate(dtoInstance, { validationError: { target: true } });
    return validationErrors;
}

// export async function validateInput<T extends object>(dtoClass: new () => T, input: any, req, res, next) {
//     const inputFields = req.body;
//     const dtoInstance = plainToClass(dtoClass, input);
//     const validationErrors = await validate(dtoInstance, { validationError: { target: true } });
//     if (validationErrors.length > 0) {
//         return res.status(400).json(
//             customResponse({
//                 status: "failure",
//                 errors: validationErrors.map((err) => ({ property: err.property, error: err.constraints })),
//                 message: `Validation error`,
//                 statusCode: 400,
//             })
//         );
//     } else {
//         return next();
//     }
// }
