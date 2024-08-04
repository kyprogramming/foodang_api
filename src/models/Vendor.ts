import mongoose, { Schema, Document, Model } from "mongoose";
import { IFood } from "./Food";

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

const VendorSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerName: { type: String, required: true },
        foodType: { type: [String] },
        pincode: { type: String, required: true },
        address: { type: String },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        serviceAvailable: { type: Boolean },
        coverImages: { type: Array },
        rating: { type: Number },
        foods: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "food",
            },
        ],
        lat: { type: Number },
        lng: { type: Number },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

const Vendor = mongoose.model<IVendor>("vendor", VendorSchema);

export { Vendor };
