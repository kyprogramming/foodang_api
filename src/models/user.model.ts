import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../interfaces";

// Social Authentication Schema const SocialAuthSchema = new Schema({ provider: { type: String, enum: ["email", "google", "facebook"], required: true }, providerId: { type: String, required: true },
// accessToken: { type: String, required: true }, refreshToken: String, });

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
        name: { type: String, required: true }, //required
        email: { type: String, required: true, unique: true, lowercase: true }, //required
        emailOtp: String,
        emailOtpExpiry: { type: Date },
        emailVerified: { type: Boolean, default: false },
        password: { type: String },
        salt: { type: String },
        passwordResetToken: String,
        passwordResetExpires: Date,
        profilePicture: { type: String },
        mobile: { type: String },
        callingCode: { type: String },
        mobileOtp: { type: Number },
        mobileOtpExpiry: { type: Date },
        mobileVerified: { type: Boolean, default: false },
        lastLogin: Date,
        isActive: { type: Boolean, default: true },
        preferences: PreferenceSchema,
        addresses: [addressSchema],
        googleId: { type: String, unique: true, sparse: true },
        facebookId: { type: String, unique: true, sparse: true },
        xId: { type: String, unique: true, sparse: true },
        authProvider: { type: [String], required: true }, // Array of strings
        refreshToken: { type: String, unique: true, sparse: true },
        cart: [CartSchema],
        orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
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
