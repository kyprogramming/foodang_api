import mongoose, { Schema, Document, Model } from "mongoose";
import { IOffer } from "../interfaces";

const OfferSchema = new Schema(
    {
        offerType: { type: String, require: true },
        restaurants: [{ type: Schema.Types.ObjectId, ref: "restaurant" }],
        title: { type: String, require: true },
        description: { type: String },
        minValue: { type: Number, require: true },
        offerAmount: { type: Number, require: true },
        startValidity: Date,
        endValidity: Date,
        promocode: { type: String, require: true },
        promoType: { type: String, require: true },
        bank: [{ type: String }],
        bins: [{ type: Number }],
        postcode: { type: String, require: true },
        active: Boolean,
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

const Offer = mongoose.model<IOffer>("offer", OfferSchema);

export { Offer };
