import { IsString, Length } from "class-validator";

export class PostcodeInput {
    @IsString()
    @Length(7, 7)
    postcode: string;
}
