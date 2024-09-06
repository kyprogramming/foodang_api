import { Document } from "mongoose";

interface IAuthProvider {
    providerName: string; // e.g., "Google", "Facebook"
    providerId: string; // Unique ID from the provider
    providerPhotoURL?: string; // Photo URL from the provider (optional)
    profileName?: string; // User profile name (optional)
}

interface IAddress {
    formattedAddress: string; // Required
    lat: number; // Required
    lng: number; // Required
    placeId: string; // Required
    placeName?: string; // Place name (optional)
    types?: string[]; // Types (optional)
    isDefault?: boolean; // Indicates if this is the default address (optional)
}

interface ICartItem {
    food: string; // ObjectId reference to "food"
    unit: number; // Quantity of the food item
}

interface IPreference {
    notifications?: boolean; // Default: true
    theme?: "light" | "dark"; // Enum: ["light", "dark"], Default: "light"
    locale?: string; // Locale (optional)
    timezone?: string; // Timezone (optional)
}

export interface IUser extends Document {
    displayName: string; // Required
    email: string; // Required, unique
    emailOtp?: string;
    emailOtpExpiry?: Date;
    emailVerified?: boolean; // Default: false
    password?: string;
    salt?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    profilePhoto?: string;
    mobile?: string;
    callingCode?: string;
    mobileOtp?: number;
    mobileOtpExpiry?: Date;
    mobileVerified?: boolean; // Default: false
    lastLogin: number;
    isActive?: boolean; // Default: true
    providers?: IAuthProvider[];
    authMethods: ("password" | "google" | "facebook")[]; // Array of authentication methods
    addresses?: IAddress[];
    cart?: ICartItem[];
    orders?: string[]; // Array of ObjectId references to "order"
    preferences?: IPreference[];
    refreshToken?: string; // Unique, sparse
}
export default IUser;
