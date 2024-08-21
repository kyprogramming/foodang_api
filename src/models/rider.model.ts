import mongoose, { Schema, Document, Model } from "mongoose";
import { IRider } from "../interfaces/IRider";

const RiderSchema = new Schema(
    {
        name: String,
        email: String,
        phone: String,
        addresses: Array,
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                delete ret.__typename;
            },
        },
        timestamps: true,
    }
);

const Rider = mongoose.model < IRider > ("rider", RiderSchema);

export { Rider };
