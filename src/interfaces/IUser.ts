// Social Authentication Interface
import { Document, Schema, Model } from "mongoose";

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
    name: string; // Required
    email: string; // Required, unique, lowercase
    emailOtp?: string;
    emailOtpExpiry?: Date;
    emailVerified?: boolean; // Default: false
    password?: string;
    salt?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    profilePicture?: string;
    mobile?: string;
    callingCode?: string;
    mobileOtp?: number;
    mobileOtpExpiry?: Date;
    mobileVerified?: boolean; // Default: false
    lastLogin?: Date;
    isActive?: boolean; // Default: true
    preferences?: IPreference;
    addresses?: IAddress[];
    googleId?: string; // Unique, sparse
    facebookId?: string; // Unique, sparse
    xId?: string; // Unique, sparse
    authProvider: string[]; // Array of strings
    refreshToken: string;
    cart?: ICart[];
    orders?: Schema.Types.ObjectId[];
}
export default IUser;
