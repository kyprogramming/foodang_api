import IFood from "./IFood";

export interface IVendor extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: any[];
    rating: number;
    foods: [IFood];
    lat: number;
    lng: number;
}

export default IVendor;
