import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../interfaces";

// Social Authentication Schema const SocialAuthSchema = new Schema({ provider: { type: String, enum: ["email", "google", "facebook"], required: true }, providerId: { type: String, required: true },
// accessToken: { type: String, required: true }, refreshToken: String, });

// Schema for individual authentication providers

const AuthProviderSchema = new Schema({
    providerName: { type: String, required: true }, // e.g., "Google", "Facebook"
    providerId: { type: String, required: true }, // Unique ID from the provider
    providerPhotoURL: { type: String, default: undefined }, // Photo URL from the provider (optional)
    profileName: { type: String }, // user profile name
});

const addressSchema = new mongoose.Schema({
    formattedAddress: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    placeId: { type: String, required: true },
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
        displayName: { type: String, required: true }, //required
        email: { type: String, required: true, unique: true, lowercase: true }, //required
        emailOtp: String,
        emailOtpExpiry: { type: Date },
        emailVerified: { type: Boolean, default: false },
        password: { type: String },
        salt: { type: String },
        passwordResetToken: String,
        passwordResetExpires: Date,
        profilePhoto: { type: String },
        mobile: { type: String },
        callingCode: { type: String },
        mobileOtp: { type: Number },
        mobileOtpExpiry: { type: Date },
        mobileVerified: { type: Boolean, default: false },
        lastLogin: { type: Number },
        isActive: { type: Boolean, default: true },
        authMethods: { type: [String], enum: ["password", "google", "facebook"], default: [] },
        providers: { type: [AuthProviderSchema], default: undefined },
        addresses: { type: [addressSchema], default: undefined },
        cart: { type: [CartSchema], default: undefined },
        orders: { type: [{ type: Schema.Types.ObjectId, ref: "order" }], default: undefined },
        preferences: { type: [PreferenceSchema], default: undefined },
        refreshToken: { type: String, unique: true, sparse: true, default: undefined },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                delete ret.password;
                delete ret.salt;
                delete ret.refreshToken;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

// UserSchema.pre("save", function (next) { this.updatedAt = Date.now(); next(); });

const User = mongoose.model<IUser>("user", UserSchema);

export { User };
