// Social Authentication Interface
import { Document, Schema, Model } from "mongoose";

interface ISocialAuth {
    provider: "email" | "google" | "facebook";
    providerId: string;
    accessToken: string;
    refreshToken?: string; // Optional
}

// Address Interface
interface IAddress {
    formattedAddress: string;
    lat: number;
    lng: number;
    placeId?: string; // Optional, unique
    placeName?: string; // Optional
    types?: string[]; // Optional
    isDefault?: boolean; // Optional, default: false
}

// Cart Interface
interface ICart {
    food: Schema.Types.ObjectId; // Reference to the food document
    unit: number;
}

// Preference Interface
interface IPreference {
    notifications?: boolean; // Optional, default: true
    theme?: "light" | "dark"; // Optional, default: "light"
    locale?: string; // Optional
    timezone?: string; // Optional
}

// User Interface
export interface IUser extends Document {
    email: string;
    emailOtp?: string; // Optional
    emailOtpExpiry?: Date; // Optional
    emailVerified?: boolean; // Optional, default: false
    passwordHash: string;
    salt: string;
    passwordResetToken?: string; // Optional
    passwordResetExpires?: Date; // Optional
    name?: string; // Optional
    profilePicture?: string; // Optional
    mobile: string;
    mobileOtp?: number; // Optional
    mobileOtpExpiry?: Date; // Optional
    mobileVerified?: boolean; // Optional, default: false
    lastLogin?: Date; // Optional
    isActive?: boolean; // Optional, default: true
    preferences?: IPreference; // Optional
    addresses?: IAddress[]; // Optional
    socialAuth?: ISocialAuth[]; // Optional
    role?: "admin" | "vendor" | "user" | "rider"; // Optional, default: "user"
    cart?: ICart[]; // Optional
    orders?: Schema.Types.ObjectId[]; // Optional, references to the order documents
}

export default IUser;