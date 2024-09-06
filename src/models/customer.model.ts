import mongoose, { Schema, Document, Model } from "mongoose";
import { ICustomer } from "../interfaces";

// Social Authentication Schema
const SocialAuthSchema = new Schema({
    provider: { type: String, enum: ["google", "facebook"], required: true },
    providerId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: String,
    profile: { locale: String, timezone: String, gender: String },
});

const CartSchema = new Schema({
    food: { type: Schema.Types.ObjectId, ref: "food", require: true },
    unit: { type: Number, require: true },
});

const PreferenceSchema = new Schema({
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
});

const addressSchema = new mongoose.Schema({
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isDefault: { type: Boolean, default: false }, // Indicates if this is the default address
});

const CustomerSchema = new Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        emailVerified: { type: Boolean, default: false },
        email_otp: String,

        passwordHash: { type: String, required: true },

        salt: { type: String, required: true },
        passwordResetToken: String,
        passwordResetExpires: Date,
        name: { type: String },
        profilePhoto: { type: String },
        address: { type: String },
        mobile: { type: String, required: true },
        mobileOtp: { type: Number },
        mobileOtpExpiry: { type: Date },
        mobileVerified: { type: Boolean, default: false },
        lastLogin: Date,
        isActive: { type: Boolean, default: true },
        preferences: PreferenceSchema,
        addresses: [addressSchema], // Array of addresses

        // Social authentication fields
        socialAuth: [SocialAuthSchema],
        role: { type: String, enum: ["admin", "vendor", "customer", "rider"], default: "customer" },
        cart: [CartSchema],
        orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.passwordHash;
                delete ret.salt;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

const Customer = mongoose.model<ICustomer>("customer", CustomerSchema);

export { Customer };
