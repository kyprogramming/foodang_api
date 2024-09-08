import { IsEmail, IsMongoId, IsNumber, IsString, Length } from "class-validator";

export class CreateCustomerInput {
    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;
}

// export class LoginInput {
//     @IsEmail()
//     email: string;

//     @Length(6, 12)
//     password: string;
// }

export class OtpRequestInput {
    @IsString()
    otp: string;
}

export class RequestUserInput {
    @IsMongoId()
    _id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;
}

export class EditCustomerProfileInput {
    @Length(3, 16)
    firstName: string;

    @Length(3, 16)
    lastName: string;

    @Length(6, 16)
    address: string;

    lat: number;
    lng: number;
}

export interface CustomerPayload {
    _id: any;
    email: string;
    verified: boolean;
}

export class CartItem {
    _id: string;
    unit: number;
}

export class OrderInputs {
    txnId: string;
    amount: string;
    //  items: [CartItem];
}

export class CreateDeliveryUserInput {
    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;

    @Length(3, 12)
    firstName: string;

    @Length(3, 12)
    lastName: string;

    @Length(6, 24)
    address: string;

    @Length(4, 12)
    postcode: string;
}

export class CreatePaymentInput {
    @IsNumber()
    amount: string;

    @IsString()
    paymentMode: string;

    @IsMongoId()
    offerId: string;
}
