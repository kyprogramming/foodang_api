import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config";

import { RestaurantPayload } from "../dto";
import { AuthPayload } from "../dto/auth.dto";
import * as crypto from "crypto";

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

// export const GeneratePassword = async (password: string, salt: string): Promise<string> => { return new Promise((resolve, reject) => { crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err,
//     derivedKey) => { if (err) reject(err); resolve(derivedKey.toString("hex")); }); }); };

// export const GeneratePassword = async (password: string, salt: string): Promise<string> => { try { const derivedKey = await crypto.pbkdf2(password, salt, 10000, 64, "sha512"); return
//     derivedKey.toString("hex"); } catch (err) { throw new Error(`Failed to generate password: ${err.message}`); } };

export const GeneratePassword = async (password: string, salt: string): Promise<string> => {
    try {
        const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
        return derivedKey.toString("hex");
    } catch (err) {
        throw new Error(`Failed to generate password: ${err.message}`);
    }
};

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string): Promise<boolean> => {
    try {
        const hashedPassword = await GeneratePassword(enteredPassword, salt);
        console.log(`Generated password: ${hashedPassword}`);
        console.log(`Saved password: ${savedPassword}`);
        return hashedPassword === savedPassword;
    } catch (error) {
        console.error("Error validating password:", error);
        return false;
    }
};

// TODO: need to remove below function
export const GenerateToken = async (payload: AuthPayload) => {
    const accessToken = jwt.sign(payload, envConfig?.ACCESS_TOKEN_SECRET ?? "", { expiresIn: "1d" });
    const refreshToken = jwt.sign(payload, envConfig?.REFRESH_TOKEN_SECRET ?? "", { expiresIn: "90d" });
    return { accessToken, refreshToken };
};
export const GenerateAccessToken = (payload: AuthPayload) => {
    return jwt.sign(payload, envConfig?.ACCESS_TOKEN_SECRET ?? "", { algorithm: "HS256", expiresIn: "1h" });
};
export const GenerateResetToken = (payload: AuthPayload) => {
    return jwt.sign(payload, envConfig?.ACCESS_TOKEN_SECRET ?? "", { algorithm: "HS256", expiresIn: "1h" });
};

export const VerifyResetToken = (token: string) => {
    return jwt.verify(token, envConfig?.ACCESS_TOKEN_SECRET);
};
// export const GenerateRefreshToken = (payload: AuthPayload) => { return jwt.sign(payload, envConfig?.REFRESH_TOKEN_SECRET ?? "", { expiresIn: "90d" }); };

export function GenerateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}
export function GenerateOtpWithExpiry() {
    const otp = GenerateOTP(); // Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry (in milliseconds)

    return { otp:String(otp), expiresAt };
}
export function GenerateRefreshToken() {
    return crypto.randomBytes(40).toString("hex");
}

export const ValidateSignature = async (req: Request) => {
    const signature = req.get("Authorization");

    if (signature) {
        try {
            const payload = jwt.verify(signature.split(" ")[1], envConfig?.ACCESS_TOKEN_SECRET ?? "", { algorithms: ["HS256"] }) as AuthPayload;
            req.user = payload;
            return true;
        } catch (err) {
            return false;
        }
    }
    return false;
};

export const GenerateResetPasswordLink = (resetToken: string) => {
    // const resetLink = `${envConfig.SERVICE_URL}/user/reset-password?token=${resetToken}`;
    const resetLink = `${envConfig.ANDROID_APP}/reset-password?token=${resetToken}`;
    return resetLink;
};
