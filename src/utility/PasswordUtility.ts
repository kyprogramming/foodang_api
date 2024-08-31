import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config";

import { RestaurantPayload } from "../dto";
import { AuthPayload } from "../dto/auth.dto";

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
// TODO: need to remove below function
export const GenerateToken = async (payload: AuthPayload) => {
    return jwt.sign(payload, envConfig?.APP_SECRET ?? "", { expiresIn: "90d" });
};
export const GenerateAccessToken = async (payload: AuthPayload) => {
    return jwt.sign(payload, envConfig?.ACCESS_TOKEN_SECRET ?? "", { expiresIn: "1d" });
};
export const GenerateRefreshToken = async (payload: AuthPayload) => {
    return jwt.sign(payload, envConfig?.REFRESH_TOKEN_SECRET ?? "", { expiresIn: "90d" });
};

export const ValidateSignature = async (req: Request) => {
    const signature = req.get("Authorization");

    if (signature) {
        try {
            const payload = jwt.verify(signature.split(" ")[1], envConfig?.APP_SECRET ?? "", { algorithms: ["HS256"] }) as AuthPayload;
            req.user = payload;
            return true;
        } catch (err) {
            return false;
        }
    }
    return false;
};
