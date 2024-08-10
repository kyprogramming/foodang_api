import IVendor from "./IVendor";

export interface IOffer extends Document {
    offerType: string;
    vendors: [IVendor];
    title: string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity: Date;
    endValidity: Date;
    promocode: string;
    promoType: string;
    bank: [any];
    bins: [any];
    postcode: string;
    isActive: boolean;
}

export default IOffer;
