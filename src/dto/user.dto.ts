import { Transform } from "class-transformer";
import { IsString, IsEmail, Length, IsNotEmpty, IsMobilePhone, Matches } from "class-validator";

export class CheckEmailExistsInput {
    // email
    @IsString()
    @Length(1, 50, { message: "Email cannot exceed 50 characters" })
    @IsEmail()
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email: string;
}

export class UserRegisterInput {
    // email
    @IsString()
    @Length(1, 50, { message: "Email cannot exceed 50 characters" })
    @IsEmail()
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email: string;

    // name
    @IsNotEmpty({ message: "Name is required" })
    @IsString()
    @Length(2, 50, { message: "Name must be between 2 and 50 characters" })
    name: string;

    // mobile
    @IsNotEmpty({ message: "Mobile number is required" })
    // TODO: // @IsMobilePhone("any", {}, { message: "Invalid mobile number" })
    mobile: string;

    // password
    @IsNotEmpty({ message: "Password is required" })
    @Length(8, 20, { message: "Password must be between 8 and 20 characters" })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one number, and one special character",
    })
    password: string;

    // callingCode
    @IsNotEmpty({ message: "Password is required" })
    callingCode: string;
}


export class UserLoginInput {
    // email
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    // password
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    @Length(8, 20, { message: "Password must be between 8 and 20 characters" })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one number, and one special character",
    })
    password: string;
}



export interface UserPayload {
    _id: any;
}