import { IOrder } from "./IOrder";

export interface ICustomer extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    cart: [any];
    orders: [IOrder];
}

export default ICustomer;
