import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../interfaces";

// Social Authentication Schema
const SocialAuthSchema = new Schema({
    provider: { type: String, enum: ["email", "google", "facebook"], required: true },
    providerId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: String,
});

const addressSchema = new mongoose.Schema({
    formattedAddress: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    placeId: { type: String, unique: true },
    placeName: { type: String },
    types: { type: [String] },
    isDefault: { type: Boolean, default: false }, // Indicates if this is the default address
});

const CartSchema = new Schema({
    food: { type: Schema.Types.ObjectId, ref: "food", require: true },
    unit: { type: Number, require: true },
});

const PreferenceSchema = new Schema({
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    locale: String,
    timezone: String,
});

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        emailOtp: String,
        emailOtpExpiry: { type: Date },
        emailVerified: { type: Boolean, default: false },
        passwordHash: { type: String, required: true },
        salt: { type: String, required: true },
        passwordResetToken: String,
        passwordResetExpires: Date,
        name: { type: String, required: true },
        profilePicture: { type: String },
        mobile: { type: String, required: true },
        callingCode: { type: String, required: true },
        mobileOtp: { type: Number },
        mobileOtpExpiry: { type: Date },
        mobileVerified: { type: Boolean, default: false },
        lastLogin: Date,
        isActive: { type: Boolean, default: true },
        preferences: PreferenceSchema,
        addresses: [addressSchema],

        // Social authentication fields
        socialAuth: [SocialAuthSchema],
        role: { type: String, enum: ["admin", "vendor", "user", "rider"], default: "user" },
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

const User = mongoose.model<IUser>("user", UserSchema);

export { User };
