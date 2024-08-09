import { Transform } from "class-transformer";
import { IsString, IsEmail, IsPhoneNumber, Length, MinLength, MaxLength, IsArray, IsNotEmpty, IsPostalCode, IsMongoId, IsBoolean } from "class-validator";

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
    @IsEmail()
    email: string;

    // password
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(50, { message: "Password cannot exceed 50 characters" })
    @Transform(({ value }) => value.trim())
    password: string;

    // phone @IsOptional()
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

// export class CreateVendorInput { name: string; ownerName: string; foodType: [string]; pincode: string; address: string; phone: string; email: string; password: string; }

export class CreateVendorInput {
    // name
    @IsString()
    @IsNotEmpty()
    name: string;

    // ownerName
    @IsString()
    @IsNotEmpty()
    ownerName: string;

    // foodType
    @IsArray()
    @IsNotEmpty({ each: true })
    @Transform(({ value }) => value.map((item: string) => item.trim()))
    foodType: string[];

    // pincode
    @IsString()
    @IsPostalCode("GB")
    pincode: string;

    // address
    @IsString()
    @IsNotEmpty()
    address: string;

    // phone
    @IsString()
    @IsPhoneNumber("GB", { message: "Invalid phone number" })
    @Transform(({ value }) => value.trim())
    phone?: string;

    // email
    @IsEmail()
    email: string;

    // password
    @IsString()
    @Length(6, 20)
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    password: string;
}

export class VerifyDeliveryUserInput {
    // _id
    @IsMongoId()
    @IsNotEmpty()
    _id: string;

    // status
    @IsBoolean()
    @IsNotEmpty()
    status: string;
}
