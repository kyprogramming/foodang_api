import IRestaurant from "./IRestaurant";

export interface IOffer extends Document {
    offerType: string;
    restaurants: [IRestaurant];
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
