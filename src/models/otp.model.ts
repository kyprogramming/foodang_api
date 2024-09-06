import mongoose, { Schema, Document, Model } from "mongoose";
import IOtp from "../interfaces/IOtp";


const OTPSchema = new Schema(
    {
        email: { type: String },
        mobile: { type: String, required: true },
        callingCode: { type: String, required: true },
        otp: { type: Number, required: true },
        expireAt: {
            type: Date,
            default: Date.now,
            expires: 300, // OTP expires after 5 minutes (300 seconds)
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

const Otp = mongoose.model<IOtp>("otp", OTPSchema);

export { Otp };
