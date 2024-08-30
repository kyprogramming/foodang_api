import { Transform } from "class-transformer";
import { IsString, IsEmail,  Length } from "class-validator";

export class CheckEmailExistsInput {
    // email
    @IsString()
    @Length(1, 50, { message: "Email cannot exceed 50 characters" })
    @IsEmail()
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email: string;
}
