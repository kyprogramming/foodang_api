
import IFood from "./IFood";

import { Document, Schema, Types } from "mongoose";
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
    email: string;
    password: string;
    name: string;
    description: string;
    vendorId: Schema.Types.ObjectId;
    address: IAddress;
    averageDeliveryTime: number;
    minOrder: number;
    saleTax: number;
    shopCategory: string;
    cuisine: string[];
    imageUrl: string;
    logoUrl: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
