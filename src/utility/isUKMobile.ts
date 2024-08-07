import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { isValidNumber, ParsedNumber, parsePhoneNumber } from "libphonenumber-js";

export function IsUKMobile(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isUKMobile",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    try {
                        const phoneNumber: any = parsePhoneNumber(value, "GB");
                        return phoneNumber && isValidNumber(phoneNumber) && phoneNumber.country === "GB";
                    } catch (error) {
                        return false;
                    }
                },
                defaultMessage(args: ValidationArguments) {
                    return "Invalid UK mobile phone number";
                },
            },
        });
    };
}
