
import IFood from "./IFood";

import { Document, Types } from "mongoose";
// import { IMenuItem } from "./MenuItem"; // Assuming MenuItem is in a separate file

interface IAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
}

interface IContactDetails {
    phone: string;
    email: string;
    website?: string;
}

interface IOpeningHours {
    [day: string]: { open: string; close: string };
}

interface IOwner {
    name: string;
    contact: string;
    email: string;
}

export interface IRestaurant extends Document {
    name: string;
    description: string;
    address: IAddress;
    contactDetails: IContactDetails;
    openingHours: IOpeningHours;
    cuisine: string[];
    rating: number;
    numberOfReviews: number;
    averageDeliveryTime: number;
    priceRange: string;
    isActive: boolean;
    // menu: Types.DocumentArray<IMenuItem>;
    images: { url: string; altText: string }[];
    owner: IOwner;
    paymentMethods: string[];
    createdAt: Date;
    updatedAt: Date;
}
