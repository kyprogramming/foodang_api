import { Transform } from "class-transformer";
import { IsString, IsEmail, IsPhoneNumber, Length, MinLength, MaxLength, IsOptional } from "class-validator";

export class SignupAdminInput {
    // name
    @IsString()
    @Length(1, 20, { message: "Name cannot exceed 20 characters" })
    @Transform(({ value }) => value.trim())
    name: string;

    // address
    @IsString()
    @Length(1, 50, { message: "Address cannot exceed 50 characters" })
    address: string;

    // email
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    // password
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(50, { message: "Password cannot exceed 50 characters" })
    @Transform(({ value }) => value.trim())
    password: string;

    // phone
    // @IsOptional()
    @IsString()
    @IsPhoneNumber("GB", { message: "Invalid phone number" })
    @Transform(({ value }) => value.trim())
    phone?: string;
}

export class AdminLoginInput {
    // email
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    // password
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(50, { message: "Password cannot exceed 50 characters" })
    @Transform(({ value }) => value.trim())
    password: string;
}
